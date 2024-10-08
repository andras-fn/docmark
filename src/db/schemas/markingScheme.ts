import { relations } from "drizzle-orm";
import { text, pgSchema, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { testCriteria } from "./testCriteria";
import type { TestCriteria } from "@/db/schemas/testCriteria";

export const docmarkaiSchema = pgSchema("docmarkai_schema");

export const markingScheme = docmarkaiSchema.table("marking_scheme", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  name: text("marking_scheme_name").notNull(),
});

export const insertMarkingSchemeSchema = createInsertSchema(markingScheme);

export type MarkingScheme = typeof markingScheme.$inferSelect;
export type MarkingSchemeWithCounts = MarkingScheme & {
  totalNumber: number;
  passNumber: number;
  failNumber: number;
};
export type ExtendedMarkingScheme = MarkingScheme & {
  testCriteria: TestCriteria[];
};
export const markingSchemeRelations = relations(markingScheme, ({ many }) => ({
  testCriteria: many(testCriteria),
}));

export const testCriteriaRelations = relations(testCriteria, ({ one }) => ({
  makingScheme: one(markingScheme, {
    fields: [testCriteria.markingSchemeId],
    references: [markingScheme.id],
  }),
}));
