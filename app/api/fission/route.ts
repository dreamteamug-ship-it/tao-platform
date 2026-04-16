import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────
// TITANIUM FISSION ENGINE
// Uses tao_users table — fully independent of auth.users
// ─────────────────────────────────────────────────────────────

function decodeToken(token: string): Record<string, string> | null {
  try {
    const cleaned = token.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    const padded  = cleaned + '='.repeat((4 - (cleaned.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Generate identity — always works even if DB is down
  const dealroomId = crypto.randomBytes(6).toString('hex').toUpperCase();
  const titaniumQR = 'TAO-TQ-' + crypto.randomBytes(8).toString('hex').toUpperCase();
  const phone      = decoded.phone || decoded.referrer || `guest_${Date.now()}`;
  const country    = decoded.region || decoded.country || 'KE';
  const assetId    = decoded.asset_id || decoded.asset || null;

  let dbSaved  = false;
  let savedId  = '';
  let warnings: string[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Use tao_users — no foreign key, no role check, no full_name constraint
    const { data, error } = await supabase
      .from('tao_users')
      .upsert([{
        phone,
        country,
        home_currency:         'KES',
        home_lat:              -1.2864,
        home_lng:              36.8172,
        titanium_qr:           titaniumQR,
        dealroom_id:           dealroomId,
        referred_by:           decoded.referrer || decoded.ref || null,
        asset_id:              assetId,
        fission_registered:    true,
        fission_registered_at: new Date().toISOString(),
      }], { onConflict: 'phone', ignoreDuplicates: false })
      .select('id')
      .single();

    if (error) {
      warnings.push(error.message);
    } else {
      dbSaved = true;
      savedId = data?.id || '';
    }
  } catch (err: any) {
    warnings.push(`Network: ${err.message}`);
  }

  const base     = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirect = `${base}/dealroom/${dealroomId}?qr=${titaniumQR}${assetId ? `&asset=${assetId}` : ''}`;

  return NextResponse.json({
    status:     'verified',
    dbSaved,
    profileId:  savedId,
    titaniumQR,
    dealroomId,
    redirect,
    warnings:   warnings.length ? warnings : undefined,
  });
}

export async function POST(request: Request) {
  try {
    const body  = await request.json().catch(() => ({}));
    const { phone = `guest_${Date.now()}`, assetId, country = 'KE', ref } = body;
    const payload = { phone, asset_id: assetId || '', region: country, referrer: ref || '', timestamp: new Date().toISOString() };
    const token   = Buffer.from(JSON.stringify(payload)).toString('base64');
    const base    = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const link    = `${base}/api/fission?token=${encodeURIComponent(token)}`;
    return NextResponse.json({
      token,
      shareLink:    link,
      whatsappLink: `https://wa.me/?text=${encodeURIComponent(`🏛️ TAO Platform — Your Titanium Dealroom:\n${link}`)}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
