ALTER TABLE "session" DROP CONSTRAINT "session_session_token_unique";--> statement-breakpoint
ALTER TABLE "session" ADD PRIMARY KEY ("session_token");--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "session_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "id";