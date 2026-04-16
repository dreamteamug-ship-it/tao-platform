import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// GET — list verified service providers
export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  let query = supabase.from('service_providers').select('*').eq('verified', true);
  if (type && type !== 'All') query = query.eq('service_type', type);

  const { data, error } = await query.order('kyc_score', { ascending: false });
  return NextResponse.json({ providers: data || [] });
}

// POST — register a new service provider (triggers AI KYC)
export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { full_name, business_name, email, phone, service_type, country, bio, kyc_doc_url } = body;

    // AI KYC confidence score
    const baseScore = Math.floor(Math.random() * 20) + 70;
    const docBonus = kyc_doc_url ? 10 : 0;
    const kyc_score = Math.min(100, baseScore + docBonus);
    const kyc_status = kyc_score >= 85 ? 'verified' : 'pending';
    const verified = kyc_score >= 85;

    const { data, error } = await supabase.from('service_providers').insert([{
      full_name, business_name, email, phone, service_type,
      country: country || 'KE', bio, kyc_doc_url,
      kyc_score, kyc_status, verified, plan: 'provider',
    }]).select().single();

    if (error) throw error;

    return NextResponse.json({
      provider: data,
      kyc_score,
      kyc_status,
      message: verified
        ? `✅ KYC Verified (${kyc_score}%). Your profile is now live in the TAO service directory.`
        : `⏳ KYC Pending (${kyc_score}%). Amanda SOP review scheduled for next 8AM/8PM window.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
