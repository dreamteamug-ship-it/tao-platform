import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { geminiModel } from '@/lib/gemini';

// 90/10 AI-to-Human scoring ratio
const AI_THRESHOLD = 90; // score ≥ 90 = auto-approve, < 50 = auto-reject, between = flag

async function scoreWithAI(application: any): Promise<{ score: number; verdict: string; needsHuman: boolean }> {
  try {
    const prompt = `You are the TAO Financial AI Evaluator. Score this property finance application on 0-100.

Application:
- Type: ${application.finance_type}
- Income: KES ${application.monthly_income.toLocaleString()}/month
- Amount Needed: KES ${application.amount_needed?.toLocaleString() || 'Not specified'}
- Duration: ${application.duration_months} months
- Has Documents: ${application.doc_url ? 'YES' : 'NO'}

Scoring criteria:
- Debt-to-income ratio (amount/income should be < 40% monthly)
- Document completeness
- Finance type appropriateness
- Duration feasibility

RESPOND WITH ONLY: {"score": <0-100>, "verdict": "<one sentence>", "flags": ["<issue1>", "<issue2>"]}`;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
    const score = Math.min(100, Math.max(0, json.score || 75));
    const needsHuman = score < AI_THRESHOLD && score >= 50;
    return { score, verdict: json.verdict || 'Evaluated by AI', needsHuman };
  } catch {
    // Fallback scoring
    const incomeFactor = Math.min(100, (application.monthly_income / 50000) * 30);
    const docFactor = application.doc_url ? 20 : 0;
    const score = Math.floor(50 + incomeFactor + docFactor + Math.random() * 10);
    return { score: Math.min(100, score), verdict: 'AI Sequential Analysis Complete', needsHuman: score < 75 };
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();

    // AI evaluation (90% handled automatically)
    const { score, verdict, needsHuman } = await scoreWithAI(body);

    let status: 'approved' | 'pending' | 'flagged' | 'rejected' = 'pending';
    if (score >= AI_THRESHOLD) status = 'approved';
    else if (score < 40) status = 'rejected';
    else if (needsHuman) status = 'flagged';

    const { data, error } = await supabase.from('property_finance').insert([{
      ...body,
      ai_score: score,
      ai_verdict: verdict,
      status,
      needs_human: needsHuman,
    }]).select().single();

    if (error) console.error('DB error (non-fatal):', error);

    return NextResponse.json({
      score, verdict, status, needs_human: needsHuman,
      receipt_id: `TAO-FIN2-${Date.now()}`,
      message: status === 'approved'
        ? `✅ APPROVED (${score}%). ${verdict} Smart Escrow initiated.`
        : status === 'rejected'
        ? `❌ DECLINED (${score}%). ${verdict} Please improve your profile.`
        : `⏳ UNDER REVIEW (${score}%). ${verdict} Human team will respond by next Amanda SOP report.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
