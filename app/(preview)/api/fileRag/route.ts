import fs from 'fs';
import path from 'path';
import { createFileContent } from '@/lib/actions/files'
import { NextRequest, NextResponse } from 'next/server';


async function storeEmbeddings(fileName: string) {
  const filePath = path.join(process.cwd(), 'public', `data/${fileName}`);
  // 读取文件内容
  const content = fs.readFileSync(filePath, 'utf-8');
  createFileContent({ content })
}

// GET 方法
export async function POST(request: NextRequest) {
  storeEmbeddings('qiu.txt').catch(console.error);
  return NextResponse.json({
    body: 'ok'
  });
}