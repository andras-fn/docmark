import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import {
  markingRunPermutations,
  MarkingRunPermutations,
} from "@/db/schemas/markingRunPermutations";

export async function GET(
  request: Request,
  { params }: { params: { testPermutationId: string } }
) {
  try {
    const testPermutationId = params.testPermutationId;

    console.log("Fetching Test Permutation details");
    // get the job id for the test permutation
    const testPermutation: MarkingRunPermutations[] = (await db
      .select()
      .from(markingRunPermutations)
      .where(
        eq(markingRunPermutations.id, testPermutationId)
      )) as MarkingRunPermutations[];
    // return the job status
    return Response.json({ status: 200, data: testPermutation });
  } catch (error) {
    console.error(error);
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}
