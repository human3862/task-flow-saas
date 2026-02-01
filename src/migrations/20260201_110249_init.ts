import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_tasks_priority" AS ENUM('low', 'medium', 'high');
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"decription" varchar,
  	"author_id" integer,
  	"is_public" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'user' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "nickname" varchar NOT NULL;
  ALTER TABLE "tasks" ADD COLUMN "priority" "enum_tasks_priority" DEFAULT 'medium' NOT NULL;
  ALTER TABLE "tasks" ADD COLUMN "project_id" integer;
  ALTER TABLE "tasks" ADD COLUMN "position" numeric;
  ALTER TABLE "tasks" ADD COLUMN "author_id" integer NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_author_idx" ON "projects" USING btree ("author_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "users_nickname_idx" ON "users" USING btree ("nickname");
  CREATE INDEX "tasks_project_idx" ON "tasks" USING btree ("project_id");
  CREATE INDEX "tasks_position_idx" ON "tasks" USING btree ("position");
  CREATE INDEX "tasks_author_idx" ON "tasks" USING btree ("author_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects" CASCADE;
  ALTER TABLE "tasks" DROP CONSTRAINT "tasks_project_id_projects_id_fk";
  
  ALTER TABLE "tasks" DROP CONSTRAINT "tasks_author_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  DROP INDEX "users_nickname_idx";
  DROP INDEX "tasks_project_idx";
  DROP INDEX "tasks_position_idx";
  DROP INDEX "tasks_author_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "nickname";
  ALTER TABLE "tasks" DROP COLUMN "priority";
  ALTER TABLE "tasks" DROP COLUMN "project_id";
  ALTER TABLE "tasks" DROP COLUMN "position";
  ALTER TABLE "tasks" DROP COLUMN "author_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_tasks_priority";`)
}
