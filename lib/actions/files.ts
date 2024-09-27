"use server";

import {
  NewFileContentParams,
  insertFileSchema,
  fileContent,
} from "@/lib/db/schema/files";
import { generateEmbeddings } from "../ai/fileEmbedding";
import { db } from "../db";
import { embeddings as embeddingsTable } from "../db/schema/fileembeddings";

export const createFileContent = async (input: NewFileContentParams) => {
  try {
    const { content } = insertFileSchema.parse(input);

    const [resource] = await db
      .insert(fileContent)
      .values({ content })
      .returning();

    const embeddings = await generateEmbeddings(content, { chunkSize: 500, chunkOverlap: 100 });
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        fileId: resource.id,
        ...embedding,
      })),
    );
    return "Resource successfully created and embedded.";
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};
