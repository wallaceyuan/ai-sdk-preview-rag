"use server";

import {
  NewFileContentParams,
  insertFileSchema,
  files,
} from "@/lib/db/schema/k/files";
import { db } from "@/lib/db";

export const createKnowledgeFile = async (input: NewFileContentParams) => {
  try {
    const { filename } = insertFileSchema.parse(input);
    await db
      .insert(files)
      .values({ content: '', filename })
      .returning();

    return "Resource successfully created and embedded.";
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};


export const selectKnowledgeFile = async() => {
  const resource = await db.select({
    id: files.id,
    filename: files.filename,
  }).from(files)
  return resource;
}