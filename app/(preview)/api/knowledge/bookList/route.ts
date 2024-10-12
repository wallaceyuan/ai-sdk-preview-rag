import { NextRequest, NextResponse } from 'next/server';
import { selectKnowledgeFile } from '@/lib/actions/k/files'

export async function GET(request: NextRequest) {
  const res = await selectKnowledgeFile();
  return NextResponse.json({
    files: res
  });
}
