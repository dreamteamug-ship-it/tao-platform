import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ status: 'ZENITH_ALIGNED', delta: Math.random() * 0.05 });
}
