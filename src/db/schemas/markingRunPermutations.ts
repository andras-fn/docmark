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
import { markingRun } from "./markingRun";

export const docmarkaiSchema = pgSchema("docmarkai_schema");

export const statusEnum = docmarkaiSchema.enum("status", [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
]);

export const markingRunPermutations = docmarkaiSchema.table(
  "marking_run_permutations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
    markingRunId: uuid("marking_run_id").notNull(),
    documentGroupId: uuid("document_group_id").notNull(),
    documentId: uuid("document_id").notNull(),
    markingSchemeId: uuid("marking_scheme_id").notNull(),
    status: statusEnum("status").notNull().default("NOT_STARTED"),
    completed: boolean("completed").notNull().default(false),
    completedTime: timestamp("completed_time"),
    timeTaken: real("time_taken"),
    jobId: uuid("job_id"),
    totalTests: real("total_tests"),
    passedTests: real("passed_tests"),
    failedTests: real("failed_tests"),
  }
);

export const insertMarkingRunPermutationsSchema = createInsertSchema(
  markingRunPermutations
);

export type MarkingRunPermutations = typeof markingRunPermutations.$inferSelect;
