const documentGroups = require("./seedData/documentGroups.json");
const documents = require("./seedData/documents.json");
const markingSchemes = require("./seedData/markingSchemes.json");

import { db } from "../client";
import {
  documentGroup,
  insertDocumentGroupSchema,
} from "../schemas/documentGroup";
import { document, insertDocumentSchema } from "../schemas/document";
import {
  markingScheme,
  insertMarkingSchemeSchema,
} from "../schemas/markingScheme";
import {
  testCriteria,
  insertTestCriteriaSchema,
} from "../schemas/testCriteria";

(async () => {
  // create document groups
  const documentGroupPromises = documentGroups.map(async (group: any) => {
    const parsedDocumentGroup = insertDocumentGroupSchema.parse(group);
    return db.insert(documentGroup).values(parsedDocumentGroup).returning({
      id: documentGroup.id,
    });
  });

  const [documentGroupResults] = await Promise.all(documentGroupPromises);

  console.log("--- Document Group Results ---");
  console.log(documentGroupResults);

  // create documents
  const documentWithDocumentGroupIds = documents.map(
    (document: any, i: number) => {
      return {
        ...document,
        documentGroupId: documentGroupResults[0].id,
        documentName: `Patient ${i + 1}`,
      };
    }
  );

  const documentResults = await db
    .insert(document)
    .values(documentWithDocumentGroupIds)
    .returning({
      id: document.id,
    });

  console.log("--- Document Results ---");
  console.log(documentResults);

  // create marking schemes
  const markingSchemePromises = markingSchemes.map(async (scheme: any) => {
    const markingSchemeId: string = await db.transaction(async (tx) => {
      const [returnedMarkingschemeId] = await tx
        .insert(markingScheme)
        .values(scheme)
        .returning({ id: markingScheme.id });

      await tx.insert(testCriteria).values(
        scheme.testCriteria.map((criteria: any) => {
          return { ...criteria, markingSchemeId: returnedMarkingschemeId.id };
        })
      );

      return returnedMarkingschemeId.id;
    });

    return markingSchemeId;
  });

  const [markingSchemeResults] = await Promise.all(markingSchemePromises);

  console.log("--- Marking Scheme Results ---");
  console.log(markingSchemeResults);

  process.exit(0);
})();
