ALTER TABLE "docmarkai_schema"."session" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."user" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."documents" ADD COLUMN "user_prompt" text NOT NULL;--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."documents" ADD COLUMN "system_prompt" text NOT NULL;