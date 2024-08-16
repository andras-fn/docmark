import { relations } from "drizzle-orm";
import { text, pgSchema, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { documentGroup } from "./documentGroup";

export const docmarkaiSchema = pgSchema("docmarkai_schema");

export const document = docmarkaiSchema.table("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  documentName: text("document_name").notNull(),
  documentText: text("document_text").notNull(),
  aiResults: jsonb("ai_results").notNull(),
  documentGroupId: uuid("document_group_id").notNull(),
  userPrompt: text("user_prompt").notNull(),
  systemPrompt: text("system_prompt").notNull(),
});

export const insertDocumentSchema = createInsertSchema(document);

export type Document = typeof document.$inferSelect;
export type NewDocument = typeof document.$inferInsert;

// relations
export const documentGroupRelations = relations(documentGroup, ({ many }) => ({
  documents: many(document),
}));

export const documentRelations = relations(document, ({ one }) => ({
  documentGroup: one(documentGroup, {
    fields: [document.documentGroupId],
    references: [documentGroup.id],
  }),
}));
