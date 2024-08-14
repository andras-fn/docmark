import { markingRun, type MarkingRun } from "@/db/schemas/markingRun";
import { document } from "@/db/schemas/document";
import { markingRunPermutations } from "@/db/schemas/markingRunPermutations";
import { eq, and, count } from "drizzle-orm";
import { db } from "@/db/client";
import { isValidUUID } from "@/lib/isValidUUID";

import { validateRequest } from "@/auth/auth";

// Utility function to chunk an array into smaller arrays of a specified size
function chunkArray(array: string | any[], size: number) {
  const results = [];
  for (let i = 0; i < array.length; i += size) {
    results.push(array.slice(i, i + size));
  }
  return results;
}

// Function to process promises in batches
async function processInBatches(promises: string | any[], batchSize: number) {
  const chunks = chunkArray(promises, batchSize);
  const results = [];

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk);
    results.push(...chunkResults);
  }

  return results;
}

export async function POST(
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
    console.log(markingRunId);

    if (!isValidUUID(markingRunId)) {
      console.error("Invalid UUID: ", markingRunId);
      throw new Error("Invalid UUID passed as marking run ID");
    }

    const [result]: MarkingRun[] = (await db
      .select()
      .from(markingRun)
      .where(
        and(eq(markingRun.completed, false) && eq(markingRun.id, markingRunId))
      )) as MarkingRun[];

    console.log(result);

    if (!result) {
      console.error("Marking Run not found: ", markingRunId);
      return;
    }

    const resultMarkingSchemes = result.markingSchemes as string[];

    const results = [];

    for (const documentGroup of result?.documentGroups as string[]) {
      const resultObj = {
        documentGroupId: documentGroup,
        documentCount: 0,
        permutations: [] as {
          markingSchemeId: string;
          markingRunId: string;
          documentId: string;
          markingRunPermutationId: string;
        }[],
      };
      console.log("Document Group: ", documentGroup);

      const [documentCount] = await db
        .select({ count: count() })
        .from(document)
        .where(eq(document.documentGroupId, documentGroup));

      console.log("Document Count: ", documentCount.count);

      let numberOfPages = Math.ceil(documentCount.count / 100);
      console.log(
        `Number of times we're going to have to loop: ${numberOfPages}`
      );

      let permutations = new Set();

      const pagePromises = [];
      for (let i = 0; i < numberOfPages; i++) {
        pagePromises.push(
          db
            .select({ id: document.id })
            .from(document)
            .where(eq(document.documentGroupId, documentGroup))
            .limit(100)
            .offset(i * 100)
            .orderBy(document.createdAt)
        );
      }

      const pageResults = await processInBatches(pagePromises, 5); // Adjust batch size as needed

      pageResults.flat().forEach((doc) => {
        resultMarkingSchemes.forEach((scheme: string) => {
          permutations.add({
            markingRunId: markingRunId,
            documentGroupId: documentGroup,
            documentId: doc.id,
            markingSchemeId: scheme,
          });
        });
      });

      //console.log("Permutations: ", permutations);
      console.log("Permutations Size: ", permutations.size);

      const permutationsArray: {
        documentGroupId: string;
        markingSchemeId: string;
        markingRunId: string;
        documentId: string;
      }[] = Array.from(permutations) as {
        documentGroupId: string;
        markingSchemeId: string;
        markingRunId: string;
        documentId: string;
      }[];
      //console.log("Permutations Array: ", permutationsArray);

      if (permutationsArray.length === 0) {
        console.error("No permutations found for marking run: ", markingRunId);
        return;
      }

      const markingRunPermutationsInsertResult: {
        markingSchemeId: string;
        markingRunId: string;
        documentId: string;
        markingRunPermutationId: string;
      }[] = await db
        .insert(markingRunPermutations)
        .values(
          permutationsArray.map((permutation) => ({
            documentGroupId: permutation.documentGroupId,
            markingSchemeId: permutation.markingSchemeId,
            markingRunId: permutation.markingRunId,
            documentId: permutation.documentId,
          }))
        )
        .returning({
          markingRunId: markingRunPermutations.markingRunId,
          markingRunPermutationId: markingRunPermutations.id,
          documentId: markingRunPermutations.documentId,
          markingSchemeId: markingRunPermutations.markingSchemeId,
        });

      //console.log(markingRunPermutationsInsertResult);

      resultObj.documentCount = documentCount.count;
      resultObj.permutations = markingRunPermutationsInsertResult;
      results.push(resultObj);
    }

    return Response.json(
      {
        status: 201,
        data: [...results],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ status: 400, issues: `${error}` }, { status: 500 });
  }
}
