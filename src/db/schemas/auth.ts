import {
  text,
  pgSchema,
  uuid,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const docmarkaiSchema = pgSchema("docmarkai_schema");

export const userTable = docmarkaiSchema.table("user", {
  id: text("id").primaryKey(),
  githubId: text("github_id").notNull(),
  username: text("username").notNull(),
});

export const sessionTable = docmarkaiSchema.table("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
