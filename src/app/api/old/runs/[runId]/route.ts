import { db } from "@/db/client";
import { run, runDocument, document, runResults } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { runId: string } }
) {
  try {
    const { runId } = params;

    const runs = await db
      .select()
      .from(run)
      .where(eq(run.id, runId))
      .leftJoin(runDocument, eq(run.id, runDocument.runId))
      .leftJoin(
        runResults,
        and(
          eq(run.id, runResults.runId),
          eq(runDocument.documentId, runResults.documentId)
        )
      )
      .leftJoin(document, eq(runDocument.documentId, document.id));

    //console.log(runs);

    const reducerFunction = (input) => {
      // Initialize the output structure
      const output = {
        runId: "",
        runName: "",
        documents: [],
      };

      input.forEach((item) => {
        //console.log(item);
        // Set runId and runName if not already set
        if (!output.runId || !output.runName) {
          output.runId = item.runs.id;
          output.runName = item.runs.runName;
        }

        // Parse the results string into a JSON object
        const results = JSON.parse(JSON.parse(item.run_results.results));

        // Iterate through the results and construct the documents and markingCriteria structure
        results.results.forEach((result) => {
          //console.log(result);
          // Check if the document already exists in the output
          let document = output.documents.find(
            (doc) => doc.documentId === item.run_results.documentId
          );
          if (!document) {
            // If not, create a new document object and push it to the output
            document = {
              documentId: item.run_results.documentId,
              documentName: item.documents.documentName, // Assuming documentName is available elsewhere or not necessary for this structure
              markingCriteria: [],
            };
            output.documents.push(document);
          }

          //console.log(result);
          const markingCriteria = {
            markingCriteriaId: result.markingCriteriaId,
            markingCriteriaName: result.markingCriteriaName,
            overallResult: {
              totalPossibleScore: result.totalPossibleScore,
              overallScore: result.overallScore,
              comment: result.overallComment,
            },
            results: {
              summary: result.categories.summary.descriptions.map(
                (description) => ({
                  descriptionId: description.descriptionId,
                  description: description.description,
                  evaluation: description.evaluation,
                  comment: description.comment,
                })
              ),
              nextActions: result.categories.nextActions.descriptions.map(
                (description) => ({
                  descriptionId: description.descriptionId,
                  description: description.description,
                  evaluation: description.evaluation,
                  comment: description.comment,
                })
              ),
              keyDiagnosis: result.categories.keyDiagnosis.descriptions.map(
                (description) => ({
                  descriptionId: description.descriptionId,
                  description: description.description,
                  evaluation: description.evaluation,
                  comment: description.comment,
                })
              ),
              anyNewMedication:
                result.categories.anyNewMedication.descriptions.map(
                  (description) => ({
                    descriptionId: description.descriptionId,
                    description: description.description,
                    evaluation: description.evaluation,
                    comment: description.comment,
                  })
                ),
            },
          };

          // Add the markingCriteria to the document
          document.markingCriteria.push(markingCriteria);
        });
      });

      return output;
    };

    const transformedOutput = reducerFunction(runs);
    //console.log(transformedOutput, null, 2);

    return Response.json({ data: transformedOutput }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
