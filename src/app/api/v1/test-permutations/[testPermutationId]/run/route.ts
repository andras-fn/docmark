import { isValidUUID } from "@/lib/isValidUUID";
import { db } from "@/db/client";
import {
  markingRunPermutations,
  MarkingRunPermutations,
} from "@/db/schemas/markingRunPermutations";
import { getAssoToken } from "@/lib/getAssoToken";
import { createPlatformServiceJob } from "@/lib/createPlatformServiceJob";
import { eq } from "drizzle-orm";
import { document } from "@/db/schemas/document";
import { markingScheme } from "@/db/schemas/markingScheme";
import { testCriteria } from "@/db/schemas/testCriteria";
import { validateRequest } from "@/auth/auth";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: { testPermutationId: string };
  }
) {
  const { user } = await validateRequest();
  if (!user) {
    return Response.json(
      { status: 401, issues: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    //console.log(params);
    const testPermutationId = params.testPermutationId;
    //console.log(testPermutationId);

    if (!isValidUUID(testPermutationId)) {
      console.error("Invalid UUID: ", testPermutationId);
      return Response.json(
        { status: 500, issues: [`Invalid UUID passed as marking run ID`] },
        { status: 200 }
      );
    }

    const [testPermutation]: MarkingRunPermutations[] = (await db
      .select()
      .from(markingRunPermutations)
      .where(
        eq(markingRunPermutations.id, testPermutationId)
      )) as unknown as MarkingRunPermutations[];

    //console.log(testPermutation);

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
        markingSchemeId: markingScheme.id,
        markingSchemeName: markingScheme.name,
        testCriteriaId: testCriteria.id,
        testCriteriaDescription: testCriteria.testDescription,
        testCriteriaCategory: testCriteria.category,
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

    const markingSchemeReducedResult: { [key: string]: any } =
      markingSchemeResult.reduce((acc: { [key: string]: any }, row) => {
        const markingSchemeId = row.markingSchemeId;
        if (!acc[markingSchemeId]) {
          acc[markingSchemeId] = {
            id: markingSchemeId,
            name: row.markingSchemeName,
            testCriteria: [],
          };
        }
        if (row.testCriteriaId) {
          acc[markingSchemeId].testCriteria.push({
            id: row.testCriteriaId,
            description: row.testCriteriaDescription,
            category: row.testCriteriaCategory,
          });
        }
        return acc;
      }, {});

    const text = `${JSON.stringify(
      {
        document: [documentResult],
        markingCriteria: [markingSchemeReducedResult],
      },
      null,
      2
    )}`;

    console.log(`Text: ${text}`);

    const tokenResponse = await getAssoToken(
      process.env.ASSO_CLIENT_ID || "",
      process.env.ASSO_CLIENT_SECRET || "",
      process.env.ASSO_TOKEN_URL || ""
    );

    console.log(`Asso Token: ${JSON.stringify(tokenResponse, null, 2)}`);

    if (
      !tokenResponse.success ||
      tokenResponse.data.access_token === undefined
    ) {
      throw new Error(
        `${testPermutationId} | Error fetching token: ${tokenResponse.error}`
      );
    }

    const platformServiceMetadata = [
      { key: "markingRunId", value: testPermutation.markingRunId },
      {
        key: "markingRunPermutationId",
        value: testPermutationId,
      },
      { key: "documentId", value: testPermutation.documentId },
      { key: "markingSchemeId", value: testPermutation.markingSchemeId },
    ];

    console.log(
      `Platform Service Metadata: ${JSON.stringify(
        platformServiceMetadata,
        null,
        2
      )}`
    );

    const jobResponse = await createPlatformServiceJob(
      tokenResponse.data.access_token,
      text,
      process.env.AI_PLATFORM_PROMPT_ID || "",
      platformServiceMetadata,
      process.env.AI_PLATFORM_SERVICE_URL_CREATE_JOB || ""
    );

    console.log(`Job ID: ${JSON.stringify(jobResponse, null, 2)}`);

    if (!jobResponse.data || !jobResponse.data.hasOwnProperty("jobId")) {
      const error = `Invalid response from Platform Service: ${jobResponse.error}`;

      throw new Error(`${testPermutationId} | Error creating job: ${error}`);
    }

    await db
      .update(markingRunPermutations)
      .set({
        status: "IN_PROGRESS",
        jobId: jobResponse.data.jobId,
      })
      .where(eq(markingRunPermutations.id, testPermutationId));

    console.log(
      `Updated marking run permutation (${testPermutationId}) with jobId: ${jobResponse.data.jobId}`
    );

    return Response.json(
      {
        status: 200,
        data: {
          jobId: jobResponse.data.jobId,
          testPermutationId: testPermutationId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ status: 500, issues: error }, { status: 500 });
  }
}
