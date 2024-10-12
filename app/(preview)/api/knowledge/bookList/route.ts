import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // storeFile('github-copliot.pdf').catch(console.error);
  return NextResponse.json({
    body: 'ok'
  });
}
