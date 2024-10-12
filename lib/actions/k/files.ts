"use server";

import {
  NewFileContentParams,
  insertFileSchema,
  files,
} from "@/lib/db/schema/k/files";
import { generateEmbeddings } from "@/lib/ai/embedding";
import { db } from "@/lib/db";
import { embeddings as embeddingsTable } from "@/lib/db/schema/embeddings";

export const createKnowledgeFile = async (input: NewFileContentParams) => {
  try {
    const { content, filename } = insertFileSchema.parse(input);

    const [resource] = await db
      .insert(files)
      .values({ content: '', filename })
      .returning();

    // const embeddings = await generateEmbeddings(content);
    // await db.insert(embeddingsTable).values(
    //   embeddings.map((embedding) => ({
    //     resourceId: resource.id,
    //     ...embedding,
    //   })),
    // );
    return "Resource successfully created and embedded.";
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};
