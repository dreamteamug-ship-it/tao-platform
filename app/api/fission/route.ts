import { NextResponse } from 'next/server';

export async function GET() {
  const drId = "DR-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  return NextResponse.json({
    success: true,
    dealroomId: drId,
    mode: 'ATOMIC_ZENITH'
  });
}