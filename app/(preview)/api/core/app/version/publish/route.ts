import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // storeEmbeddings('kong.txt').catch(console.error);
  return NextResponse.json({
    body: 'ok'
  });
}

