import {
  text,
  pgSchema,
  uuid,
  timestamp,
  real,
  boolean,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { testCriteria } from "./testCriteria";
import { comment } from "postcss";

export const docmarkaiSchema = pgSchema("docmarkai_schema");

export const evaluationEnum = docmarkaiSchema.enum("status", ["PASS", "FAIL"]);

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
  evaluation: evaluationEnum("status").notNull(),
  comment: text("comment").notNull(),
});
