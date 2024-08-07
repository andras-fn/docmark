import { text, pgSchema, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const docmarkaiSchema = pgSchema("docmarkai_schema");

export const testCriteria = docmarkaiSchema.table("test_criteria", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  testDescription: text("test_description").notNull(),
  markingSchemeId: uuid("marking_scheme_id").notNull(),
  category: text("category").notNull(),
});

export const insertTestCriteriaSchema = createInsertSchema(testCriteria);

export type TestCriteria = typeof testCriteria.$inferSelect;
