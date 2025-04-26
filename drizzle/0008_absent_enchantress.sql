ALTER TABLE "projects" RENAME COLUMN "owner_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_owner_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "projects_user_id_idx" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_user_id_name_unique_idx" ON "projects" USING btree ("user_id","name");