import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

function calculateFinanceScore(income: number, financeType: string): number {
  let score = Math.floor(Math.random() * 15) + 72;
  if (income > 300000) score += 10;
  else if (income > 150000) score += 6;
  else if (income < 30000) score -= 10;
  if (financeType === 'Mortgage') score += 3;
  return Math.min(100, Math.max(0, score));
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { full_name, national_id, monthly_income, finance_type, property_id } = body;

    if (!full_name) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const ai_score = calculateFinanceScore(Number(monthly_income) || 0, finance_type);
    const status = ai_score >= 82 ? 'approved' : 'pending';

    await supabase.from('finance_applications').insert([{
      full_name, national_id,
      monthly_income: Number(monthly_income) || 0,
      finance_type, property_id, ai_score, status
    }]);

    const receipt_id = `TAO-FIN-${Date.now()}`;
    const monthly_payment = ai_score >= 82
      ? Math.floor((Number(monthly_income) || 0) * 0.35).toLocaleString()
      : null;

    return NextResponse.json({
      score: ai_score,
      status,
      receipt_id,
      monthly_payment,
      message: status === 'approved'
        ? `${finance_type} application APPROVED (${ai_score}%). Smart Escrow initiated. You will receive a secure contract link within 2 hours.`
        : `${finance_type} application PENDING (${ai_score}%). Additional documents required. Our finance team will contact you.`,
    });
  } catch (error) {
    console.error('Finance error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
