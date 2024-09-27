import fs from 'fs';
import path from 'path';
import { embedMany } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextRequest, NextResponse } from 'next/server';
import { IndexFlatL2 } from 'faiss-node';
import fetch from '@/lib/fetch'
import "dotenv/config";


function splitText(text: string, options: { chunkSize: number;  chunkOverlap: number}) {
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

async function storeEmbeddings(fileName: string) {

  const filePath = path.join(process.cwd(), 'public', `data/${fileName}`);

  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // console.log('fileContent', fileContent)

  const chunks = splitText(fileContent, { chunkSize: 500, chunkOverlap: 100 })

  // console.log('chunks', chunks)

  const openai = createOpenAI({
    fetch: fetch
  });

  // return

  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: chunks,
  });

  console.log('embeddings', embeddings)

  // 创建 FAISS 索引
  // 转换 embeddings 为二维数组
  const vectors = embeddings.map(embedding => new Float32Array(embedding));

  // 初始化 FAISS 向量库
  const dimension = vectors[0].length; // 获取向量维度
  const index = new IndexFlatL2(dimension); // 使用 L2 距离的索引

  // 将 embeddings 转换为一维数组并添加到索引
  for (const embedding of embeddings) {
    index.add(embedding); // 添加每个向量
  }

  // Save index
  const fname = 'faiss.index';
  index.write(fname);
//   // 存入 FAISS
//   const floatArray = new Float32Array(embeddings.flat());
//   const numberArray = Array.from(floatArray); // 转换为 number[]
//   index.add(numberArray)

//   // 保存索引到文件
  const dirName = path.basename(fileName, path.extname(fileName)); // 获取文件名
//   fs.mkdirSync(dirName, { recursive: true });
//   index.write(path.join(dirName, 'index.faiss'));

  // 保存 segments 以便召回
  fs.writeFileSync(('segments.json'), JSON.stringify(chunks));
  console.log(`Embeddings 已成功存入 ${dirName} 目录`);
// }
}

// export async function POST(req: Request, res: any) {
//   await storeEmbeddings('qiu.txt').catch(console.error);
//   // const baseDir = __dirname;
//   return NextResponse.json({
//     body: 'ok'
//   });
// }



// 模拟的数据源
const data = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
];
// GET 方法
export async function POST(request: NextRequest) {

  // // 获取查询参数
  // const id = request.nextUrl.searchParams.get('id');
  
  // if (id) {
  //   // 根据 ID 查找数据
  //   const item = data.find(item => item.id === parseInt(id));
    
  //   if (!item) {
  //     return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  //   }
    
  //   return NextResponse.json(item);
  // }

  // // 返回所有数据
  // return NextResponse.json(data);

  storeEmbeddings('qiu.txt').catch(console.error);
  // const baseDir = __dirname;
  return NextResponse.json({
    body: 'ok'
  });
}

storeEmbeddings('qiu.txt').catch(console.error);