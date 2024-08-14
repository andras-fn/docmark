import { eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { markingRun, MarkingRun } from "@/db/schemas/markingRun";
import { markingScheme, MarkingScheme } from "@/db/schemas/markingScheme";

export async function GET(
  request: Request,
  { params }: { params: { runId: string } }
) {
  try {
    const markingRunId = params.runId;

    const [markingSchemeIds]: MarkingRun[] = await db
      .select({ markingSchemes: markingRun.markingSchemes })
      .from(markingRun)
      .where(eq(markingRun.id, markingRunId));

    //console.log(markingSchemeIds);

    if (!markingSchemeIds) {
      throw new Error("No marking schemes found for this marking run");
    }

    const markingSchemes: MarkingScheme[] = await db
      .select()
      .from(markingScheme)
      .where(inArray(markingScheme.id, markingSchemeIds.markingSchemes));
    // return the job status
    return Response.json({ status: 200, data: markingSchemes });
  } catch (error) {
    console.error(error);
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}
