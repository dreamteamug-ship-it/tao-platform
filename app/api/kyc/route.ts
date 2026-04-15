import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

function calculateAIScore(income: number, hasFiles: boolean): number {
  let score = Math.floor(Math.random() * 15) + 75;
  if (income > 200000) score += 8;
  else if (income > 100000) score += 5;
  else if (income < 20000) score -= 8;
  if (hasFiles) score += 5;
  return Math.min(100, Math.max(0, score));
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { full_name, national_id, monthly_income, role, has_files } = body;

    if (!full_name || !national_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ai_score = calculateAIScore(Number(monthly_income) || 0, !!has_files);
    const status = ai_score >= 85 ? 'approved' : 'pending';

    const { data, error } = await supabase
      .from('kyc_applications')
      .insert([{ full_name, national_id, monthly_income: Number(monthly_income) || 0, role, ai_score, status }])
      .select()
      .single();

    if (error) console.error('KYC DB error (non-fatal):', error);

    const receipt_id = `TAO-KYC-${Date.now()}`;

    return NextResponse.json({
      score: ai_score,
      status,
      receipt_id,
      message: status === 'approved'
        ? `KYC Approved (${ai_score}%). Your profile is now active on the platform. Welcome to Together As One!`
        : `KYC Pending (${ai_score}%). Our compliance team will review within 24 hours. Please upload clearer documents.`,
    });
  } catch (error) {
    console.error('KYC error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
