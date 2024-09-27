import { nanoid } from "@/lib/utils";
import { index, pgTable, text, varchar, vector } from "drizzle-orm/pg-core";
import { fileContent } from "./files";

export const embeddings = pgTable(
  "fileembeddings",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    fileId: varchar("file_id", { length: 191 }).references(
      () => fileContent.id,
      { onDelete: "cascade" },
    ),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    fileEmbeddingIndex: index("fileEmbeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);
