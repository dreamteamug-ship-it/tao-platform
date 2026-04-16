import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🏦 [EQUITY_INGEST]:', body.transaction_id);
    return NextResponse.json({ state: 'FUNDS_LOCKED', transaction_id: body.transaction_id });
  } catch (err: any) {
    return NextResponse.json({ error: 'Webhook Crash' }, { status: 500 });
  }
}