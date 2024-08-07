DO $$ BEGIN
 CREATE TYPE "docmarkai_schema"."status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "docmarkai_schema"."marking_run_permutations" ADD COLUMN "status" "docmarkai_schema"."status" DEFAULT 'NOT_STARTED' NOT NULL;