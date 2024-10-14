import { embed, embedMany } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import fetch from '@/lib/fetch'
import { cosineDistance, desc, gt, sql, and, eq } from "drizzle-orm";
import { embeddings } from "../db/schema/fileembeddings";
import { knowledgefileembeddings } from "../db/schema/k/knowledgefileembeddings";

import { db } from "../db";

const openai = createOpenAI({
  fetch: fetch
});

const embeddingModel = openai.embedding("text-embedding-ada-002");

const splitText = (text: string, options: { chunkSize: number;  chunkOverlap: number}) => {
  const { chunkSize, chunkOverlap } = options;
  const splitters = ['\n', '======', '==SPLIT=='];
  const regex = new RegExp(splitters.join('|'), 'g');
  
  const chunks = [];
  const segments = text.split(regex);
  let currentChunk = '';

  for (let segment of segments) {
    if (currentChunk.length + segment.length + 1 > chunkSize) {
      chunks.push(currentChunk);
      currentChunk = segment;
    } else {
      currentChunk += (currentChunk.length ? ' ' : '') + segment;
    }

    // Add overlap
    if (currentChunk.length >= chunkSize) {
      currentChunk = currentChunk.slice(-chunkOverlap);
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}


export const generateKnowledgeEmbeddings = async (
  value: string,
  options: { chunkSize: number;  chunkOverlap: number}
): Promise<Array<{ embedding: number[]; }>> => {
  const chunks = splitText(value, options);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ embedding: e }));
};

export const generateEmbeddings = async (
  value: string,
  options: { chunkSize: number;  chunkOverlap: number}
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = splitText(value, options);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string, fileId: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, userQueryEmbedded)})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(and(eq(embeddings.fileId, fileId), gt(similarity, 0.3)))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides;
};


export const findRelevantKnowledgeContent = async (userQuery: string, knowledgeId: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(knowledgefileembeddings.embedding, userQueryEmbedded)})`;
  const similarGuides = await db
    .select({ similarity })
    .from(knowledgefileembeddings)
    .where(and(eq(knowledgefileembeddings.knowledgeId, knowledgeId), gt(similarity, 0.3)))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides;
};

