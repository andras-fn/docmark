import {
  text,
  pgSchema,
  uuid,
  timestamp,
  jsonb,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { markingRunPermutations } from "./markingRunPermutations";

export const docmarkaiSchema = pgSchema("docmarkai_schema");

export const markingRun = docmarkaiSchema.table("marking_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  name: text("description").notNull(),
  numberOfDocumentGroups: integer("number_of_document_groups").notNull(),
  numberOfDocuments: integer("number_of_documents").notNull(),
  numberOfMarkingSchemes: integer("number_of_marking_schemes").notNull(),
  numberOfTestCriteria: integer("number_of_test_criteria").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedTime: timestamp("completed_time"),
  documentGroups: jsonb("document_groups").notNull(),
  markingSchemes: jsonb("marking_schemes").notNull(),
});

export const insertMarkingRunSchema = createInsertSchema(markingRun);

export type MarkingRun = typeof markingRun.$inferSelect;

// create a relationship between markingRun, markingRunPermutations and markingRunTestCriteriaResults
// relations
// markingRun and markingRunPermutations
export const markingRunRelations = relations(markingRun, ({ many }) => ({
  markingRuns: many(markingRunPermutations),
}));

export const markingRunPermutationsRelations = relations(
  markingRunPermutations,
  ({ one }) => ({
    markingRun: one(markingRun, {
      fields: [markingRunPermutations.markingRunId],
      references: [markingRun.id],
    }),
  })
);
