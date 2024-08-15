import { eq, and } from "drizzle-orm";
import { db } from "@/db/client";
import { markingRunResults } from "@/db/schemas/markingRunResults";
import { document } from "@/db/schemas/document";
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

    const url = new URL(request.url);
    const urlParams = {
      documentGroupId: url.searchParams.get("documentGroupId"),
      markingSchemeId: url.searchParams.get("markingSchemeId"),
    };

    //console.log(urlParams);

    if (!urlParams.documentGroupId || !urlParams.markingSchemeId) {
      throw new Error(
        "Missing required parameters: documentGroupId, markingSchemeId"
      );
    }

    const rawResults = await db
      .select({
        documentId: markingRunResults.documentId,
        documentName: document.documentName,
        results: {
          testPermutationId: markingRunResults.testPermutationId,
          category: markingRunResults.category,
          testCriteriaId: markingRunResults.testCriteriaId,
          testDescription: markingRunResults.testDescription,
          evaluation: markingRunResults.evaluation,
          comment: markingRunResults.comment,
        },
      })
      .from(markingRunResults)
      .leftJoin(document, eq(markingRunResults.documentId, document.id))
      .where(
        and(
          eq(markingRunResults.markingRunId, markingRunId),
          eq(markingRunResults.documentGroupId, urlParams.documentGroupId),
          eq(markingRunResults.markingSchemeId, urlParams.markingSchemeId)
        )
      );

    //.groupBy(markingRunResults.documentId, document.documentName);

    //console.log(rawResults);

    interface ExistingDocument {
      documentId: string;
      documentName: string | null;
      results: any[]; // Update the type of results to match the actual type
    }

    const documentResults = rawResults.reduce((acc, row) => {
      const { documentId, documentName, ...result } = row;

      let existingDocument = acc.find(
        (doc) => doc.documentId === documentId
      ) as ExistingDocument | undefined;

      if (!existingDocument) {
        existingDocument = {
          documentId,
          documentName,
          results: [],
        };
        acc.push(existingDocument);
      }

      existingDocument.results.push(result.results);

      return acc;
    }, [] as ExistingDocument[]);

    if (!documentResults) {
      throw new Error("No documents found for this marking run");
    }

    return Response.json({ status: 200, data: documentResults });
  } catch (error) {
    console.error(error);
    return Response.json({ status: 400, issues: error }, { status: 500 });
  }
}
