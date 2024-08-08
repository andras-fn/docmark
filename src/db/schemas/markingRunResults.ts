import { text, pgSchema, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { markingScheme } from "./markingScheme";
import { documentGroup, DocumentGroup } from "./documentGroup";
export const docmarkaiSchema = pgSchema("docmarkai_schema");

export const evaluationEnum = docmarkaiSchema.enum("evaluation", [
  "PASS",
  "FAIL",
]);

export const markingRunResults = docmarkaiSchema.table("marking_run_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  markingRunId: uuid("marking_run_id").notNull(),
  documentGroupId: uuid("document_group_id").notNull(),
  documentId: uuid("document_id").notNull(),
  markingSchemeId: uuid("marking_scheme_id").notNull(),
  testPermutationId: uuid("test_permutation_id").notNull(),
  category: text("category").notNull(),
  testCriteriaId: uuid("test_criteria_id").notNull(),
  testDescription: text("test_description").notNull(),
  evaluation: evaluationEnum("evaluation").notNull(),
  comment: text("comment").notNull(),
});

export const insertMarkingRunResultsSchema =
  createInsertSchema(markingRunResults);

export type MarkingRunResults = typeof markingRunResults.$inferSelect;
export type InsertMarkingRunResults = typeof markingRunResults.$inferInsert;

export const markingSchemeRelations = relations(markingScheme, ({ many }) => ({
  markingSchemes: many(markingRunResults),
}));

export const markingRunResultsRelations = relations(
  markingRunResults,
  ({ one }) => ({
    markingScheme: one(markingScheme, {
      fields: [markingRunResults.markingSchemeId],
      references: [markingScheme.id],
    }),
  })
);
export const documentGroupRelations = relations(documentGroup, ({ many }) => ({
  documentGroups: many(markingRunResults),
}));

export const markingRunResultsDocumentGroupsRelations = relations(
  markingRunResults,
  ({ one }) => ({
    documentGroup: one(documentGroup, {
      fields: [markingRunResults.documentGroupId],
      references: [documentGroup.id],
    }),
  })
);
