import { db } from "@/db/client";
import {
  markingRunPermutations,
  MarkingRunPermutations,
} from "@/db/schemas/markingRunPermutations";
import { getAssoToken } from "@/lib/getAssoToken";
import { eq, and, count } from "drizzle-orm";
import { getPlatformServiceJobStatus } from "@/lib/getPlatformServiceJobStatus";

export async function GET(
  request: Request,
  { params }: { params: { testPermutationId: string } }
) {
  try {
    console.log("GET /api/v1/test-permutations/[testPermutationId]/job-status");
    // get the test permutation id from the url
    const testPermutationId = params.testPermutationId;

    console.log("Fetching Test Permutation details");
    // get the job id for the test permutation
    const [testPermutation]: MarkingRunPermutations[] = (await db
      .select()
      .from(markingRunPermutations)
      .where(
        eq(markingRunPermutations.id, testPermutationId)
      )) as MarkingRunPermutations[];

    console.log(testPermutation);

    if (!testPermutation) {
      return Response.json(
        { status: 404, issues: ["Test Permutation not found"] },
        { status: 404 }
      );
    }

    console.log("Generating authentication token");
    // generate asso token
    const tokenResponse = await getAssoToken(
      process.env.ASSO_CLIENT_ID || "",
      process.env.ASSO_CLIENT_SECRET || "",
      process.env.ASSO_TOKEN_URL || ""
    );

    //console.log(`Asso Token: ${JSON.stringify(tokenResponse, null, 2)}`);

    // check the asso token result
    if (
      !tokenResponse.success ||
      tokenResponse.data.access_token === undefined
    ) {
      throw new Error(
        `${testPermutationId} | Error fetching token: ${tokenResponse.error}`
      );
    }

    console.log("Fetching job status");
    // get the job status
    const jobStatus = await getPlatformServiceJobStatus(
      tokenResponse.data.access_token,
      testPermutation.jobId as string,
      process.env.AI_PLATFORM_SERVICE_URL_GET_JOB_STATUS || ""
    );

    console.log(
      `Job Status: ${JSON.stringify(jobStatus.data.status, null, 2)}`
    );

    console.log("Returning job status");
    // return the job status
    return Response.json({ status: 200, data: jobStatus.data });
  } catch (error) {
    console.error(error);
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}

// get is not working from postman
