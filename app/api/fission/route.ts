import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────
// TITANIUM FISSION — ONE-SHARE REGISTRATION ENGINE
// WhatsApp share token → profile → Titanium QR → /dealroom/[id]
// Default Home State: Kenya (-1.2864, 36.8172, KES)
// ─────────────────────────────────────────────────────────────

const FISSION_SECRET = process.env.FISSION_SECRET || 'TAO_TITANIUM_FISSION_2026';

function decryptToken(token: string): Record<string, string> | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parsed = JSON.parse(decoded);
    // In production: verify HMAC signature
    return parsed;
  } catch {
    return null;
  }
}

function generateTitaniumQR(userId: string): string {
  const hash = crypto
    .createHmac('sha256', FISSION_SECRET)
    .update(userId + Date.now().toString())
    .digest('hex')
    .toUpperCase()
    .slice(0, 16);
  return `TAO-TQ-${hash}`;
}

function generateDealroomId(): string {
  return crypto.randomUUID().replace(/-/g, '').toUpperCase().slice(0, 12);
}

// GET /api/fission?token=<base64url>
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing share token' }, { status: 400 });
  }

  const payload = decryptToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired share token' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // Resolve or create profile
    const phone = payload.phone || '';
    const referredBy = payload.ref || null;
    const assetId = payload.asset || null;
    const country = payload.country || 'KE';
    const lang = payload.lang || 'en';

    // Check if profile exists
    let { data: existing } = await supabase
      .from('profiles')
      .select('id, titanium_qr, dealroom_id')
      .eq('phone', phone)
      .maybeSingle();

    let profileId: string;
    let titaniumQR: string;
    let dealroomId: string;

    if (existing) {
      profileId = existing.id;
      titaniumQR = existing.titanium_qr || generateTitaniumQR(existing.id);
      dealroomId = existing.dealroom_id || generateDealroomId();

      // Update QR if missing
      if (!existing.titanium_qr || !existing.dealroom_id) {
        await supabase
          .from('profiles')
          .update({ titanium_qr: titaniumQR, dealroom_id: dealroomId })
          .eq('id', profileId);
      }
    } else {
      // Auto-generate new profile
      dealroomId = generateDealroomId();
      const newQR = generateTitaniumQR(phone || dealroomId);
      titaniumQR = newQR;

      const { data: created, error: insertErr } = await supabase
        .from('profiles')
        .insert([{
          phone,
          country,
          preferred_language: lang,
          referred_by: referredBy,
          home_lat: -1.2864,   // Default: Nairobi, Kenya
          home_lng: 36.8172,
          home_currency: 'KES',
          titanium_qr: titaniumQR,
          dealroom_id: dealroomId,
          role: 'buyer',
          fission_registered: true,
          fission_registered_at: new Date().toISOString(),
        }])
        .select('id')
        .single();

      if (insertErr) throw insertErr;
      profileId = created!.id;
    }

    // Log the fission event
    await supabase.from('fission_events').insert([{
      profile_id: profileId,
      token_payload: payload,
      asset_id: assetId,
      referred_by: referredBy,
      dealroom_id: dealroomId,
      created_at: new Date().toISOString(),
    }]).select();

    // Build secure redirect URL
    const redirectUrl = `/dealroom/${dealroomId}?qr=${titaniumQR}${assetId ? `&asset=${assetId}` : ''}`;

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch (err: any) {
    console.error('[FISSION] Error:', err.message);
    return NextResponse.json({ error: 'Fission registration failed', detail: err.message }, { status: 500 });
  }
}

// POST /api/fission — generate a new share token for WhatsApp
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, assetId, country = 'KE', lang = 'en', ref } = body;

    if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });

    const payload = {
      phone,
      asset: assetId || '',
      country,
      lang,
      ref: ref || '',
      ts: Date.now(),
    };

    const token = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const shareLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://tao-platform.vercel.app'}/api/fission?token=${token}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(`🏛️ TAO Sovereign Platform — You've been invited!\n\nAccess your private Titanium Dealroom:\n${shareLink}\n\n_Powered by Together As One_`)}`;

    return NextResponse.json({ token, shareLink, whatsappLink });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
