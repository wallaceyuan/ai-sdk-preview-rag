import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable, primaryKey, foreignKey } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { nanoid } from "@/lib/utils";

import { knowledges } from './knowledges'
import { files } from './files'


export const knowledgeFiles = pgTable(
  'knowledge_files',
  {
    knowledgeId: varchar('knowledge_id').notNull(),
    fileId: varchar('file_id').notNull(),
  },
  (table) => ({
    pk: primaryKey(table.knowledgeId, table.fileId),
    fkKnowledge: foreignKey({ columns: [table.knowledgeId], foreignColumns: [knowledges.id] }),
    fkFile: foreignKey({ columns: [table.fileId], foreignColumns: [files.id] }),
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
