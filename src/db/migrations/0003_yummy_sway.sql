CREATE TABLE IF NOT EXISTS "docmarkai_schema"."bulk_upload_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"document_group_id" uuid NOT NULL,
	"bucket" text NOT NULL,
	"region" text NOT NULL,
	"access_key" text,
	"secret_key" text,
	"folder" text,
	"access_key_iv" text,
	"secret_key_iv" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "docmarkai_schema"."bulk_upload_data" ADD CONSTRAINT "bulk_upload_data_document_group_id_document_groups_id_fk" FOREIGN KEY ("document_group_id") REFERENCES "docmarkai_schema"."document_groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
