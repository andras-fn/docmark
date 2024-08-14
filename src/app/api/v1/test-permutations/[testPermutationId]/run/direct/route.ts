import { isValidUUID } from "@/lib/isValidUUID";
import { db } from "@/db/client";
import {
  markingRunPermutations,
  MarkingRunPermutations,
} from "@/db/schemas/markingRunPermutations";
import {
  markingRunResults,
  MarkingRunResults,
  InsertMarkingRunResults,
} from "@/db/schemas/markingRunResults";
import { eq, and, count } from "drizzle-orm";
import { document } from "@/db/schemas/document";

import OpenAI from "openai";
import { systemMessage } from "@/lib/systemMessage";

import { reduceResults } from "@/app/api/v1/marking-schemes/route";

import { markingScheme } from "@/db/schemas/markingScheme";
import { testCriteria } from "@/db/schemas/testCriteria";

export async function POST(
  request: Request,
  { params }: { params: { testPermutationId: string } }
) {
  try {
    // get the test permutation id from the url
    const testPermutationId = params.testPermutationId;
    //console.log(testPermutationId);

    // check if the test permutation id is a valid UUID
    if (!isValidUUID(testPermutationId)) {
      console.error("Invalid UUID: ", testPermutationId);
      return Response.json(
        { status: 500, issues: [`Invalid UUID passed as marking run ID`] },
        { status: 200 }
      );
    }

    // get the test permutation from the database
    const [testPermutation]: MarkingRunPermutations[] = (await db
      .select()
      .from(markingRunPermutations)
      .where(
        eq(markingRunPermutations.id, testPermutationId)
      )) as unknown as MarkingRunPermutations[];

    //console.log(testPermutation);

    // fetch document and marking scheme from database
    const documentQuery = db
      .select({
        documentId: document.id,
        documentName: document.documentName,
        documentText: document.documentText,
        aiResults: document.aiResults,
      })
      .from(document)
      .where(eq(document.id, testPermutation.documentId));

    const markingSchemeQuery = db
      .select({
        markingScheme: markingScheme,
        testCriteria: {
          testCriteriaId: testCriteria.id,
          testDescription: testCriteria.testDescription,
          category: testCriteria.category,
        },
      })
      .from(markingScheme)
      .leftJoin(
        testCriteria,
        eq(markingScheme.id, testCriteria.markingSchemeId)
      )
      .where(eq(markingScheme.id, testPermutation.markingSchemeId));

    const [documentResult, markingSchemeResult] = await Promise.all([
      documentQuery,
      markingSchemeQuery,
    ]);

    //console.log(JSON.stringify(markingSchemeResult, null, 2));

    const reducedMarkingSchemeResult = await reduceResults(markingSchemeResult);

    // generate text
    const text = `${JSON.stringify(
      {
        document: [documentResult],
        markingCriteria: [reducedMarkingSchemeResult],
      },
      null,
      2
    )}`;

    // ping openai direct
    const resource = process.env.AZURE_OPENAI_RESOURCE;
    const model = process.env.AZURE_OPENAI_MODEL;
    const apiVersion = "2023-03-15-preview";
    const apiKey = process.env["AZURE_OPENAI_API_KEY"];

    if (!apiKey) {
      return {
        success: false,
        error:
          "The AZURE_OPENAI_API_KEY environment variable is missing or empty.",
      };
    }

    const baseURL = `https://${resource}.openai.azure.com/openai/deployments/${model}`;

    // Azure OpenAI requires a custom baseURL, api-version query param, and api-key header.
    const openai = new OpenAI({
      apiKey,
      baseURL,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: { "api-key": apiKey },
    });

    const result = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      temperature: 0,
      messages: [
        systemMessage,
        {
          role: "user",
          content: text,
        },
      ],
    });

    // console.log(result);

    const content = JSON.parse(result?.choices[0]?.message.content || "");

    //console.log(content);

    // what do we need to update?
    // - marking run permutations
    // - marking run results
    const markingResults: InsertMarkingRunResults[] = [];

    // summary, keyDiagnosis, anyNewMedication, nextActions, urgency
    const categories = Object.keys(content.results.categories);
    categories.forEach((category) => {
      content.results.categories[category].testCriteria.forEach(
        (criteria: any) => {
          markingResults.push({
            markingRunId: testPermutation.markingRunId,
            documentGroupId: testPermutation.documentGroupId,
            documentId: testPermutation.documentId,
            markingSchemeId: testPermutation.markingSchemeId,
            testPermutationId: testPermutation.id,
            category: category,
            testCriteriaId: criteria.testCriteriaId,
            testDescription: criteria.testDescription,
            evaluation: criteria.evaluation,
            comment: criteria.comment,
          });
        }
      );
    });

    //console.log(markingResults);

    // update database with the jobId
    console.log("Updating markingRunPermutations");
    const markingRunPermutationsUpdate = db
      .update(markingRunPermutations)
      .set({
        status: "COMPLETED",
        completed: true,
        completedTime: new Date(),
        totalTests: content.results.totalPossibleScore,
        passedTests: content.results.overallScore,
        failedTests:
          content.results.totalPossibleScore - content.results.overallScore,
      })
      .where(eq(markingRunPermutations.id, testPermutationId));

    console.log("Updating markingRunResults");
    const markingRunResultsUpdate = db
      .insert(markingRunResults)
      .values(markingResults)
      .returning({ id: markingRunResults.id });

    const [markingRunPermutationsUpdateResult, markingRunResultsUpdateResult] =
      await Promise.all([
        markingRunPermutationsUpdate,
        markingRunResultsUpdate,
      ]);

    //console.log(markingRunPermutationsUpdateResult);
    //console.log(markingRunResultsUpdateResult);

    return Response.json(
      {
        status: 200,
        data: markingRunResultsUpdateResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ status: 500, issues: error }, { status: 500 });
  }
}
