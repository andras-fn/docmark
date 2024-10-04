import { text, pgSchema, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { documentGroup } from "./documentGroup";

export const docmarkaiSchema = pgSchema("docmarkai_schema");

export const statusEnum = docmarkaiSchema.enum("status", [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
]);

export const bulkUploadData = docmarkaiSchema.table("bulk_upload_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  documentGroupId: uuid("document_group_id")
    .notNull()
    .references(() => documentGroup.id),
  bucket: text("bucket").notNull(),
  region: text("region").notNull(),
  accessKey: text("access_key"),
  secretKey: text("secret_key"),
  folder: text("folder"),
  accessKeyIv: text("access_key_iv"),
  secretKeyIv: text("secret_key_iv"),
  numberOfFiles: integer("number_of_files").notNull().default(0),
  status: statusEnum("status").notNull().default("NOT_STARTED"),
});

export const insertDocumentSchema = createInsertSchema(bulkUploadData);

export type BulkUploadData = typeof bulkUploadData.$inferSelect;
export type NewBulkUploadData = typeof bulkUploadData.$inferInsert;
