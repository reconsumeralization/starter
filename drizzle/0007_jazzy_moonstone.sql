CREATE TABLE "grok_folders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "grok_images" ADD "folder_id" integer;
--> statement-breakpoint
ALTER TABLE "grok_folders" ADD CONSTRAINT "grok_folders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE "grok_images" ADD CONSTRAINT "grok_images_folder_id_grok_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "grok_folders"("id") ON DELETE SET NULL;