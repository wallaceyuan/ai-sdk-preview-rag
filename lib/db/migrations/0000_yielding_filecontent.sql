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