import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { nanoid } from "@/lib/utils";

export const knowledges = pgTable("knowledges", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name").notNull(),
  embedding: text("embedding").notNull(),
  model: varchar("model").notNull(),
});

// Schema for resources - used to validate API requests
export const insertFileSchema = createSelectSchema(knowledges)
  .extend({
    files: z.array(z.string()),
  })
  .omit({
    id: true,
  });

// Type for resources - used to type API request params and within Components
export type NewKnowledgeParams = z.infer<typeof insertFileSchema>;
