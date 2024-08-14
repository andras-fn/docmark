import { eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { markingRun, MarkingRun } from "@/db/schemas/markingRun";
import { documentGroup, DocumentGroup } from "@/db/schemas/documentGroup";
import {
  markingRunResults,
  MarkingRunResults,
} from "@/db/schemas/markingRunResults";
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

    const [documentGroupIds]: MarkingRun[] = await db
      .select({ documentGroups: markingRun.documentGroups })
      .from(markingRun)
      .where(eq(markingRun.id, markingRunId));

    //console.log(documentGroupIds);

    if (!documentGroupIds) {
      throw new Error("No document groups found for this marking run");
    }

    const documentGroups: {
      document_groups: DocumentGroup;
      marking_run_results: MarkingRunResults | null;
    }[] = await db
      .select()
      .from(documentGroup)
      .leftJoin(
        markingRunResults,
        eq(documentGroup.id, markingRunResults.documentGroupId)
      )
      .where(inArray(documentGroup.id, documentGroupIds.documentGroups));

    type NewDocumentGroup = {
      id: string;
      name: string;
      totalNumber: number;
      passNumber: number;
      failNumber: number;
    };

    const aggregatedResults: NewDocumentGroup[] = documentGroups.reduce(
      (acc: NewDocumentGroup[], item) => {
        const { id, name } = item.document_groups;
        const evaluation: string | null =
          item.marking_run_results?.evaluation ?? null;

        // Find if the document group already exists in the accumulator

        let documentGroup = acc.find((group) => group.id === id) as
          | NewDocumentGroup
          | undefined;

        if (!documentGroup) {
          // If the document group does not exist, create a new entry
          documentGroup = {
            id,
            name,
            totalNumber: 0,
            passNumber: 0,
            failNumber: 0,
          };
          acc.push(documentGroup);
        }

        // Increment the total number
        documentGroup.totalNumber += 1;

        // Increment the pass or fail number based on the evaluation
        if (evaluation === "PASS") {
          documentGroup.passNumber += 1;
        } else if (evaluation === "FAIL") {
          documentGroup.failNumber += 1;
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
