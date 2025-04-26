/*
    This migration is for PostgreSQL. If you are running on SQL Server (MSSQL), the syntax will differ.
    The following is the correct approach for PostgreSQL. For MSSQL, you must adapt types and syntax.
*/

-- 1. Drop the old primary key constraint (replace <constraint_name> with the actual PK name, e.g., session_pkey)
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_pkey";--> statement-breakpoint

-- 2. Allow NULLs on session_token (Postgres syntax)
ALTER TABLE "session" ALTER COLUMN "session_token" DROP NOT NULL;--> statement-breakpoint

-- 3. Add the new id column as primary key (Postgres syntax)
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD PRIMARY KEY ("id");--> statement-breakpoint

-- 4. Add unique constraint on session_token
ALTER TABLE "session" ADD CONSTRAINT "session_session_token_unique" UNIQUE("session_token");