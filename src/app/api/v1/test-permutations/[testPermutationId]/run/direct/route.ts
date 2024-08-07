import { isValidUUID } from "@/lib/isValidUUID";
import { db } from "@/db/client";
import {
  markingRunPermutations,
  MarkingRunPermutations,
} from "@/db/schemas/markingRunPermutations";
import { getAssoToken } from "@/lib/getAssoToken";
import { createPlatformServiceJob } from "@/lib/createPlatformServiceJob";
import { eq, and, count } from "drizzle-orm";
import { document } from "@/db/schemas/document";

import OpenAI from "openai";
import { systemMessage } from "@/lib/systemMessage";

export async function POST(
  request: Request,
  { params }: { params: { testPermutationId: string } }
) {
  try {
    // get the test permutation id from the url
    const testPermutationId = params.testPermutationId;
    console.log(testPermutationId);

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

    const markingSchemeQuery = db.query.markingScheme.findMany({
      where: (markingScheme, { eq }) =>
        eq(markingScheme.id, testPermutation.markingSchemeId),
      with: {
        testCriteria: true,
      },
    });

    const [documentResult, markingSchemeResult] = await Promise.all([
      documentQuery,
      markingSchemeQuery,
    ]);

    // console.log(`Document: ${JSON.stringify(documentResult, null, 2)}`);
    // console.log(
    //   `Marking Scheme: ${JSON.stringify(markingSchemeResult, null, 2)}`
    // );

    // generate text
    const text = `${JSON.stringify(
      {
        document: [documentResult],
        markingCriteria: [markingSchemeResult],
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

    console.log(result);

    const content = JSON.parse(result?.choices[0]?.message.content || "");

    console.log(content);

    // what do we need to update?
    // - marking run permutations

    markingRunReuslts;

    // // update database with the jobId
    // await db
    //   .update(markingRunPermutations)
    //   .set({
    //     status: "IN_PROGRESS",
    //     jobId: jobResponse.data.jobId,
    //   })
    //   .where(eq(markingRunPermutations.id, testPermutationId));

    // console.log(
    //   `Updated marking run permutation (${testPermutationId}) with jobId: ${jobResponse.data.jobId}`
    // );

    return Response.json(
      {
        status: 200,
        data: {
          content,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ status: 500, issues: error }, { status: 500 });
  }
}
