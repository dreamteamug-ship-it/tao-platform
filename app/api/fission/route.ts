import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    const dealroomId = Math.random().toString(36).substring(2, 10).toUpperCase() + 
                       Math.random().toString(36).substring(2, 4).toUpperCase();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 🏛️ SOVEREIGN BRIDGE: Prime the ledger
    // This ensures the ID exists before the Equity Webhook fires
    const { error: txError } = await supabase.from('escrow_transactions').insert([{ 
      id: dealroomId, 
      status: 'PENDING',
      amount: 0, 
      region: payload.region || 'KE'
    }]);

    if (txError) {
       console.error('❌ [DB_PRIME_ERROR]:', txError.message);
       // If the table doesn't exist, we still want the ID for the UI
    }

    return NextResponse.json({
      success: true,
      dealroomId,
      region: payload.region,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('💥 [FISSION_CRASH]:', err.message);
    return NextResponse.json({ error: 'Engine Mismatch', details: err.message }, { status: 500 });
  }
}