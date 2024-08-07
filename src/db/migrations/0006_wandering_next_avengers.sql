DO $$ BEGIN
 CREATE TYPE "docmarkai_schema"."evaluation" AS ENUM('PASS', 'FAIL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "docmarkai_schema"."marking_run_test_criteria_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"marking_run_permutation_id" uuid NOT NULL,
	"category" text NOT NULL,
	"test_description" text NOT NULL,
	"evaluation" "docmarkai_schema"."evaluation" NOT NULL,
	"comment" text
);
--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."test_criteria" RENAME COLUMN "description" TO "test_description";