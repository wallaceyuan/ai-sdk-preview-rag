import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  // storeEmbeddings('kong.txt').catch(console.error);
  return NextResponse.json({
    body: 'ok'
  });
}

