import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    const dealroomId = `DR-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${payload.region || 'KE'}`;

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    
    // Non-blocking insert to prevent 500s on DB lag
    supabase.from('escrow_transactions').insert([{ 
      id: dealroomId, status: 'PENDING', region: payload.region || 'KE', asset_id: 'GHOST-INIT' 
    }]).then(({ error }) => { if (error) console.error('DB_LAG:', error.message); });

    return NextResponse.json({
      success: true,
      dealroomId,
      region: payload.region,
      mode: 'SOVEREIGN'
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Engine Error', details: err.message }, { status: 500 });
  }
}