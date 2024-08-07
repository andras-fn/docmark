CREATE SCHEMA "docmarkai_schema";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "docmarkai_schema"."status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "docmarkai_schema"."evaluation" AS ENUM('PASS', 'FAIL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "docmarkai_schema"."documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"document_name" text NOT NULL,
	"document_text" text NOT NULL,
	"ai_results" jsonb NOT NULL,
	"document_group_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "docmarkai_schema"."document_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "docmarkai_schema"."marking_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"description" text NOT NULL,
	"number_of_document_groups" integer NOT NULL,
	"number_of_documents" integer NOT NULL,
	"number_of_marking_schemes" integer NOT NULL,
	"number_of_test_criteria" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_time" timestamp,
	"document_groups" jsonb NOT NULL,
	"marking_schemes" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "docmarkai_schema"."marking_run_permutations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"marking_run_id" uuid NOT NULL,
	"document_group_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"marking_scheme_id" uuid NOT NULL,
	"status" "docmarkai_schema"."status" DEFAULT 'NOT_STARTED' NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_time" timestamp,
	"time_taken" real,
	"job_id" uuid,
	"total_tests" real,
	"passed_tests" real,
	"failed_tests" real
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "docmarkai_schema"."marking_run_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"marking_run_id" uuid NOT NULL,
	"document_group_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"marking_scheme_id" uuid NOT NULL,
	"test_permutation_id" uuid NOT NULL,
	"category" text NOT NULL,
	"test_criteria_id" uuid NOT NULL,
	"test_description" text NOT NULL,
	"evaluation" "docmarkai_schema"."evaluation" NOT NULL,
	"comment" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "docmarkai_schema"."marking_scheme" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"marking_scheme_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "docmarkai_schema"."test_criteria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"test_description" text NOT NULL,
	"marking_scheme_id" uuid NOT NULL,
	"category" text NOT NULL
);
