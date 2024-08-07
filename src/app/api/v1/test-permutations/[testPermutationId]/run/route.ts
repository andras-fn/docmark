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

    console.log(testPermutation);

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

    console.log(`Document: ${JSON.stringify(documentResult, null, 2)}`);
    console.log(
      `Marking Scheme: ${JSON.stringify(markingSchemeResult, null, 2)}`
    );

    // generate text
    const text = `${JSON.stringify(
      {
        document: [documentResult],
        markingCriteria: [markingSchemeResult],
      },
      null,
      2
    )}`;

    console.log(`Text: ${text}`);

    // generate asso token
    const tokenResponse = await getAssoToken(
      process.env.ASSO_CLIENT_ID || "",
      process.env.ASSO_CLIENT_SECRET || "",
      process.env.ASSO_TOKEN_URL || ""
    );

    console.log(`Asso Token: ${JSON.stringify(tokenResponse, null, 2)}`);

    // check the asso token result
    if (
      !tokenResponse.success ||
      tokenResponse.data.access_token === undefined
    ) {
      throw new Error(
        `${testPermutationId} | Error fetching token: ${tokenResponse.error}`
      );
    }

    // generate the metadata for the platform request
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

    // send request to platform service
    const jobResponse = await createPlatformServiceJob(
      tokenResponse.data.access_token,
      text,
      process.env.AI_PLATFORM_PROMPT_ID || "",
      platformServiceMetadata,
      process.env.AI_PLATFORM_SERVICE_URL_CREATE_JOB || ""
    );

    console.log(`Job ID: ${JSON.stringify(jobResponse, null, 2)}`);

    // check the result of the platform service request
    if (!jobResponse.data || !jobResponse.data.hasOwnProperty("jobId")) {
      const error = `Invalid response from Platform Service: ${jobResponse.error}`;

      throw new Error(`${testPermutationId} | Error creating job: ${error}`);
    }

    // update database with the jobId
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
    return Response.json({ status: 500, issues: error }, { status: 500 });
  }
}
