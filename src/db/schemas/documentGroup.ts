import { text, pgSchema, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const docmarkaiSchema = pgSchema("docmarkai_schema");

export const documentGroup = docmarkaiSchema.table("document_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const insertDocumentGroupSchema = createInsertSchema(documentGroup);

export type DocumentGroup = typeof documentGroup.$inferSelect;
export type NewDocumentGroup = typeof documentGroup.$inferInsert;
export type DocumentGroupWithCounts = DocumentGroup & {
  totalNumber: number;
  passNumber: number;
  failNumber: number;
};
