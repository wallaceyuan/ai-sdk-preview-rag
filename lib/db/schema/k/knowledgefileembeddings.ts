import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable, primaryKey, foreignKey, serial, vector, inet} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { nanoid } from "@/lib/utils";

import { knowledges } from './knowledges'
import { files } from './files'


export const knowledgefileembeddings = pgTable(
  'knowledgefileembeddings',
  {
    id: serial('id').primaryKey(),
    fileId: inet('file_id').notNull(),
    knowledgeId: inet('knowledge_id').notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    fkFile: foreignKey({ columns: [table.fileId], foreignColumns: [files.id] }),
    fkKnowledge: foreignKey({ columns: [table.knowledgeId], foreignColumns: [knowledges.id] }),
  })
);
// Schema for resources - used to validate API requests
// export const insertFileSchema = createSelectSchema(knowledgeFiles)
//   .extend({})
//   .omit({
//     id: true,
//   });

// Type for resources - used to type API request params and within Components
// export type NewKnowledgeParams = z.infer<typeof insertFileSchema>;
