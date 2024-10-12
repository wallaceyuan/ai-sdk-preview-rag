CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "filecontents" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "fileembeddings" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"file_id" varchar(191),
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fileembeddings" ADD CONSTRAINT "embeddings_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."filecontents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fileEmbeddingIndex" ON "fileembeddings" USING hnsw ("embedding" vector_cosine_ops);





CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建 knowledge 表
CREATE TABLE IF NOT EXISTS  "knowledges" (
  -- id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "id" varchar(191) PRIMARY KEY NOT NULL,
  "name" VARCHAR NOT NULL,
  "embedding" TEXT,
  "model" VARCHAR
);

CREATE TABLE IF NOT EXISTS "files" (
  "id" varchar(191) PRIMARY KEY NOT NULL,
  "filename"  text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- 创建 knowledge_files 关联表
CREATE TABLE knowledge_files (
  knowledge_id UUID NOT NULL REFERENCES knowledges(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  PRIMARY KEY (knowledge_id, file_id)
);