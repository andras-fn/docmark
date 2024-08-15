import { eq, inArray, and } from "drizzle-orm";
import { db } from "@/db/client";
import { markingRun } from "@/db/schemas/markingRun";
import { markingScheme } from "@/db/schemas/markingScheme";
import { markingRunResults } from "@/db/schemas/markingRunResults";
import { validateRequest } from "@/auth/auth";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { runId: string };
  }
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json(
        { status: 401, issues: "Unauthorized" },
        { status: 401 }
      );
    }
    const markingRunId = params.runId;

    type MarkingSchemeResults = {
      markingSchemes: string[] | null;
    };

    const [markingSchemeIds]: MarkingSchemeResults[] = (await db
      .select({ markingSchemes: markingRun.markingSchemes })
      .from(markingRun)
      .where(eq(markingRun.id, markingRunId))) as MarkingSchemeResults[];

    //console.log(markingSchemeIds);

    if (!markingSchemeIds || markingSchemeIds.markingSchemes === null) {
      throw new Error("No marking schemes found for this marking run");
    }

    const markingSchemes = await db
      .select()
      .from(markingScheme)
      .leftJoin(
        markingRunResults,
        and(eq(markingScheme.id, markingRunResults.markingSchemeId))
      )
      .where(inArray(markingScheme.id, markingSchemeIds.markingSchemes));

    type NewMarkingScheme = {
      id: string;
      name: string;
      totalNumber: number;
      passNumber: number;
      failNumber: number;
    };

    const aggregatedResults: NewMarkingScheme[] = markingSchemes.reduce(
      (acc: NewMarkingScheme[], item) => {
        const { id, name } = item.marking_scheme;
        const evaluation: string | null =
          item.marking_run_results?.evaluation ?? null;

        // Find if the document group already exists in the accumulator

        let markingScheme = acc.find((group) => group.id === id) as
          | NewMarkingScheme
          | undefined;

        if (!markingScheme) {
          // If the document group does not exist, create a new entry
          markingScheme = {
            id,
            name,
            totalNumber: 0,
            passNumber: 0,
            failNumber: 0,
          };
          acc.push(markingScheme);
        }

        // Increment the total number
        markingScheme.totalNumber += 1;

        // Increment the pass or fail number based on the evaluation
        if (evaluation === "PASS") {
          markingScheme.passNumber += 1;
        } else if (evaluation === "FAIL") {
          markingScheme.failNumber += 1;
        }

        return acc;
      },
      []
    );
    // return the job status
    return Response.json({ status: 200, data: aggregatedResults });
  } catch (error) {
    console.error(error);
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}
