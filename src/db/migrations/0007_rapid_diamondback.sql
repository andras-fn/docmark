DROP TABLE "docmarkai_schema"."marking_run_test_criteria_results";--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."marking_run_permutations" ADD COLUMN "document_group_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."marking_run_permutations" ADD COLUMN "total_tests" real;--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."marking_run_permutations" ADD COLUMN "passed_tests" real;--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."marking_run_permutations" ADD COLUMN "failed_tests" real;--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."marking_run_permutations" ADD COLUMN "results" jsonb;