import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { markingRun, MarkingRun } from "@/db/schemas/markingRun";
import { validateRequest } from "@/auth/auth";

export async function GET(
  request: Request,
  { params }: { params: { runId: string } }
) {
  const { user } = await validateRequest();
  if (!user) {
    return Response.json(
      { status: 401, issues: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const markingRunId = params.runId;
    // get the job id for the test permutation
    const [markingRunResult]: MarkingRun[] = await db
      .select()
      .from(markingRun)
      .where(eq(markingRun.id, markingRunId));
    // return the job status
    return Response.json({ status: 200, data: markingRunResult });
  } catch (error) {
    console.error(error);
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}
