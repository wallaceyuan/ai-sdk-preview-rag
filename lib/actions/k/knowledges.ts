"use server";
import fs from 'fs';
import path from 'path';
import { eq, sql } from 'drizzle-orm'

import {
  NewKnowledgeParams,
  insertFileSchema,
  knowledges,
} from "@/lib/db/schema/k/knowledges";

import {files} from '@/lib/db/schema/k/files'
import {knowledgeFiles} from '@/lib/db/schema/k/knowledge_files'
import { generateKnowledgeEmbeddings } from "@/lib/ai/fileEmbedding";
import { knowledgefileembeddings } from '@/lib/db/schema/k/knowledgefileembeddings'

import { db } from "@/lib/db";


// 根据多个 fileId 批量查询文件名
async function getFileNamesByFileIds(fileIds: string[]) {

  const result = await db.select({ id: files.id, filename: files.filename })
    .from(files)
    if (result.length === 0) {
    throw new Error('No files found for the given IDs');
  }

  return result;
}


async function insertEmbedding(input: {fileName: string; knowledgeId: string; fileId: any} ) {
  const {fileName,knowledgeId, fileId } = input

  const filePath = path.join(process.cwd(), 'public', `data/${fileName}`);
  // 读取文件内容
  const content = fs.readFileSync(filePath, 'utf-8');

  const embeddings = await generateKnowledgeEmbeddings(content, { chunkSize: 500, chunkOverlap: 100 });

  await db.insert(knowledgefileembeddings).values(
    embeddings.map((embedding) => ({
      fileId: fileId,
      knowledgeId,
      ...embedding,
    })),
  );
}


export const createKnowledge = async (input: NewKnowledgeParams) => {
  try {
    const params = insertFileSchema.parse(input);
    const result = await db
      .insert(knowledges)
      .values({ ...params })
      .returning();

    const knowledgeId = result[0].id;

    // // 创建知识库与文件的关联
    // const fileIds = fileInsertResults.map((f) => f.id);
    await db.insert(knowledgeFiles).values(
      input.files.map((fileId) => ({ knowledgeId, fileId }))
    );

    const data = (await getFileNamesByFileIds(input.files)).filter((f) => input.files.includes(f.id) );

    console.log('data', data)

    const tasks = data?.map(d => insertEmbedding({fileName: d.filename, knowledgeId: knowledgeId, fileId: d.id}))

    await Promise.all(tasks)
    // const filePath = path.join(process.cwd(), 'public', `data/${fileName}`);
    // // 读取文件内容
    // const content = fs.readFileSync(filePath, 'utf-8');

    // // const embeddings = await generateEmbeddings(content, { chunkSize: 500, chunkOverlap: 100 });

    // // 假设我们已经有了文件的嵌入向量
    // const fileEmbeddingsData = input.files.map((fileId) => ({
    //   fileId,
    //   knowledgeId,
    //   embedding: Buffer.from('your-embedding-data-here', 'base64'), // 替换为实际的嵌入向量
    // }));

    return "Resource successfully created and embedded.";

  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};

export const selectKnowledge = async() => {
  const result = await db
  .select({
    id: knowledges.id,
    name: knowledges.name,
    embedding: knowledges.embedding,
    model: knowledges.model,
    files: sql`COALESCE(array_to_json(array_agg(jsonb_build_object('id', ${files.id}, 'filename', ${files.filename}, 'content', ${files.content}))), '[]')`
  })
  .from(knowledges)
  .leftJoin(knowledgeFiles, eq(knowledges.id, knowledgeFiles.knowledgeId))
  .leftJoin(files, eq(knowledgeFiles.fileId, files.id))
  .groupBy(knowledges.id, knowledges.name, knowledges.embedding, knowledges.model);

  return result;
}