import { randomUUID } from "crypto";
import { db } from "@/db/client";
import { run, runDocument, runMarkingCriteria } from "@/db/schema";
import { aiQueue } from "@/queues/aiQueue";

export async function POST(request: Request) {
  try {
    const res = await request.json();

    //console.log(res);

    const runId = randomUUID();

    const saveRunResult = await db.insert(run).values({
      id: runId,
      runName: res.runName,
    });

    //console.log(saveRunResult);

    const saveRunDocumentResult = await db.insert(runDocument).values(
      res.documents.map((document) => ({
        id: randomUUID(),
        runId,
        documentId: document.id,
      }))
    );

    //console.log(saveRunDocumentResult);

    const saveRunMarkingCriteriaResult = await db
      .insert(runMarkingCriteria)
      .values(
        res.markingCriteria.map((markingCriteria) => ({
          id: randomUUID(),
          runId,
          markingCriteriaId: markingCriteria.id,
        }))
      );

    const job = await aiQueue.add("generate marking job", {
      runId,
      jobType: "generate marking prompt",
    });
    //console.log(saveRunMarkingCriteriaResult);

    //console.log(job.id);

    return Response.json({ id: runId }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
