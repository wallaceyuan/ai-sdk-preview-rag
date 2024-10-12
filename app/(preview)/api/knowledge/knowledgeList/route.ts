import { NextRequest, NextResponse } from 'next/server';
import { selectKnowledge, createKnowledge } from '@/lib/actions/k/knowledges'
import { NewKnowledgeParams } from '@/lib/db/schema/k/knowledges'


export async function GET(request: NextRequest) {
  const res = await selectKnowledge();
  return NextResponse.json({
    knowledges: res
  });
}

export async function POST(request: NextRequest) {
  const params = await request.json();

  await createKnowledge(params as NewKnowledgeParams);

  return NextResponse.json({
    knowledges: 'ok'
  });
}
