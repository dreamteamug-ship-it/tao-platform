import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ status: 'HEALTHY', amanda_max_active: true, swarm_integrity: 0.98 });
}
