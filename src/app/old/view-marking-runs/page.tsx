import Wrapper from "./_components/Wrapper";
import { db } from "@/db/client";
import { eq, and, desc } from "drizzle-orm";
import { run, runDocument, document, runResults } from "@/db/schema";

const page = async () => {
  const runs = await db
    .select()
    .from(run)
    .orderBy(desc(run.createdAt))
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

  const groupedById = runs.reduce((accumulator, currentObject) => {
    // If the group for this 'id' doesn't exist, initialize it
    if (!accumulator[currentObject.runs.id]) {
      accumulator[currentObject.runs.id] = [];
    }
    // Add the current object to its group
    accumulator[currentObject.runs.id].push(currentObject);
    return accumulator;
  }, {});

  // Extract the groups into an array of arrays
  const arrayOfArrays = Object.values(groupedById);

  //console.log(arrayOfArrays);

  const reducerFunction = (input) => {
    // Initialize the output structure
    const output = {
      runId: "",
      runName: "",
      createdAt: "",
      documents: [],
    };

    input.forEach((item) => {
      //console.log(item);
      // Set runId and runName if not already set
      if (!output.runId || !output.runName) {
        output.runId = item.runs.id;
        output.runName = item.runs.runName;
        output.createdAt = item.runs.createdAt;
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

  const newRuns = [];

  arrayOfArrays.forEach((runArray) => {
    newRuns.push(reducerFunction(runArray));
  });
  //const transformedOutput = reducerFunction(runs);
  //console.log(newRuns, null, 2);

  return (
    <div className="text-black h-full w-full">
      <Wrapper runs={newRuns} />
    </div>
  );
};
export default page;
