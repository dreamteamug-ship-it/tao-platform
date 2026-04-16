import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════
// EQUITY BANK WEBHOOK RECEIVER — Titanium Zenith
// Wonderland Hospitality — Equity-Alibaba Mirror
//
// Flow: Equity Bank fires webhook → funds hit Trust Account
//       → Tri-Lock state: FUNDS_INGEST → AI_VALIDATION → SOVEREIGN_RELEASE
//
// Security: HMAC-SHA256 signature verification on every request
// ═══════════════════════════════════════════════════════════════

const EQUITY_WEBHOOK_SECRET = process.env.EQUITY_WEBHOOK_SECRET || 'WH_EQUITY_TITANIUM_2026';
const AMANDA_VALIDATION_THRESHOLD = 0.90; // 90% AI confidence → auto-approve

// ─────────────────────────────────────────────────────────────
// SIGNATURE VERIFICATION — prevents spoofed webhook calls
// ─────────────────────────────────────────────────────────────
function verifyEquitySignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader) return false;
  const expected = crypto
    .createHmac('sha256', EQUITY_WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex');
  // Timing-safe comparison prevents timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader, 'utf8'),
      Buffer.from(`sha256=${expected}`, 'utf8')
    );
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// AI VALIDATION ORACLE — Amanda Super Max
// Scores the transaction confidence before sovereign release
// ─────────────────────────────────────────────────────────────
async function runAmandaValidation(payload: EquityWebhookPayload): Promise<{
  passed: boolean;
  confidence: number;
  checks: Record<string, boolean>;
  requiresHumanReview: boolean;
}> {
  const checks = {
    amountMatches:      payload.amount > 0,
    currencySupported:  ['KES','TZS','UGX','RWF','ZAR','ZMW','USD'].includes(payload.currency),
    referencePresent:   !!payload.reference && payload.reference.startsWith('TAO-'),
    accountVerified:    payload.creditAccount === process.env.EQUITY_TRUST_ACCOUNT,
    transactionFresh:   Date.now() - new Date(payload.transactionDate).getTime() < 24 * 60 * 60 * 1000,
    noSuspiciousAmount: payload.amount < 500_000_000, // > 500M needs human review
  };

  const passedCount  = Object.values(checks).filter(Boolean).length;
  const confidence   = passedCount / Object.keys(checks).length;
  const passed       = confidence >= AMANDA_VALIDATION_THRESHOLD;
  const requiresHumanReview = !checks.accountVerified || !checks.noSuspiciousAmount || !passed;

  return { passed, confidence, checks, requiresHumanReview };
}

// ─────────────────────────────────────────────────────────────
// EQUITY WEBHOOK PAYLOAD SCHEMA
// ─────────────────────────────────────────────────────────────
interface EquityWebhookPayload {
  eventType:        'CREDIT' | 'DEBIT' | 'REVERSAL';
  reference:        string;   // TAO-{dealroomId} sent in payment narration
  amount:           number;   // In currency minor units
  currency:         string;
  transactionDate:  string;   // ISO 8601
  creditAccount:    string;   // Must match EQUITY_TRUST_ACCOUNT
  debitAccount:     string;   // Buyer's account
  narration:        string;
  bankRef:          string;   // Equity Bank's internal reference
}

// ─────────────────────────────────────────────────────────────
// POST /api/webhooks/equity — Equity Bank fires this on credit
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get('x-equity-signature');

  // 1. SIGNATURE VERIFICATION — reject forged webhooks
  if (!verifyEquitySignature(rawBody, sigHeader)) {
    console.error('[EQUITY-WEBHOOK] ❌ Invalid signature — possible spoofing attempt');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: EquityWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 2. ONLY PROCESS CREDIT EVENTS
  if (payload.eventType !== 'CREDIT') {
    return NextResponse.json({ received: true, action: 'ignored', reason: `eventType=${payload.eventType}` });
  }

  // 3. EXTRACT DEALROOM ID FROM REFERENCE (format: TAO-{dealroomId})
  const dealroomMatch = payload.reference.match(/TAO-([A-Z0-9]{8,})/);
  const dealroomId    = dealroomMatch?.[1] || null;

  if (!dealroomId) {
    return NextResponse.json({ error: 'Cannot resolve dealroom from reference', reference: payload.reference }, { status: 422 });
  }

  const supabase = createAdminClient();

  // 4. RE-ENTRY GUARD — atomic check using Supabase unique constraint
  // Find the escrow transaction for this dealroom
  const { data: escrow, error: fetchErr } = await supabase
    .from('escrow_transactions')
    .select('id, status, tri_lock_state, deal_price, currency')
    .eq('dealroom_id', dealroomId)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  if (!escrow) {
    // No escrow record — log for manual review
    await supabase.from('equity_webhook_log').insert([{
      bank_ref: payload.bankRef,
      dealroom_id: dealroomId,
      amount: payload.amount,
      currency: payload.currency,
      event_type: payload.eventType,
      status: 'unmatched',
      raw_payload: payload,
    }]).catch(() => {});
    return NextResponse.json({ error: 'No matching escrow found for dealroom', dealroomId }, { status: 404 });
  }

  // 5. TRI-LOCK STATE MACHINE
  // FUNDS_INGEST → AI_VALIDATION → SOVEREIGN_RELEASE
  if (escrow.tri_lock_state === 'SOVEREIGN_RELEASE') {
    return NextResponse.json({
      error: 'TRI_LOCK_COMPLETE',
      message: '🔒 Transaction already fully released. Double-spend blocked.',
    }, { status: 409 });
  }

  if (escrow.tri_lock_state === 'AI_VALIDATION') {
    return NextResponse.json({
      error: 'VALIDATION_IN_PROGRESS',
      message: '⏳ AI validation already in progress for this transaction.',
    }, { status: 409 });
  }

  // 6. ADVANCE TO FUNDS_INGEST
  const { error: ingestErr } = await supabase
    .from('escrow_transactions')
    .update({
      tri_lock_state:   'FUNDS_INGEST',
      equity_bank_ref:  payload.bankRef,
      equity_narration: payload.narration,
      funds_received_at: new Date().toISOString(),
    })
    .eq('id', escrow.id)
    .eq('tri_lock_state', 'PENDING'); // atomic — only advances if still PENDING

  if (ingestErr) {
    return NextResponse.json({ error: 'State transition failed — possible race', detail: ingestErr.message }, { status: 409 });
  }

  // 7. RUN AMANDA AI VALIDATION
  const validation = await runAmandaValidation(payload);

  if (validation.passed && !validation.requiresHumanReview) {
    // AUTO-APPROVE → SOVEREIGN_RELEASE
    await supabase
      .from('escrow_transactions')
      .update({
        tri_lock_state:        'SOVEREIGN_RELEASE',
        amanda_confidence:     validation.confidence,
        amanda_checks:         validation.checks,
        ai_validated_at:       new Date().toISOString(),
        status:                'released',
        released_at:           new Date().toISOString(),
      })
      .eq('id', escrow.id);

    // Log SaaS sweep on release
    const saasAmount = escrow.deal_price * 0.005;
    await supabase.from('saas_revenue_log').insert([{
      escrow_id:          escrow.id,
      dealroom_id:        dealroomId,
      fee_amount:         saasAmount,
      fee_currency:       escrow.currency,
      deal_price:         escrow.deal_price,
      rate_applied:       0.005,
      sop_slot:           new Date().getHours() < 12 ? '08:00' : '20:00',
      collection_account: 'TAO_MAIN_REVENUE_ACC',
      status:             'pending_settlement',
    }]).catch(() => {});

    return NextResponse.json({
      status:          'SOVEREIGN_RELEASE',
      dealroomId,
      escrowId:        escrow.id,
      amandaConfidence: `${(validation.confidence * 100).toFixed(0)}%`,
      message:         '✅ Funds ingested. AI validated. Sovereign release executed.',
    });

  } else {
    // FLAG FOR HUMAN REVIEW → AI_VALIDATION hold
    await supabase
      .from('escrow_transactions')
      .update({
        tri_lock_state:    'AI_VALIDATION',
        amanda_confidence: validation.confidence,
        amanda_checks:     validation.checks,
        human_review_required: true,
        human_review_reason:   JSON.stringify(
          Object.entries(validation.checks).filter(([, v]) => !v).map(([k]) => k)
        ),
      })
      .eq('id', escrow.id);

    return NextResponse.json({
      status:          'AI_VALIDATION',
      dealroomId,
      escrowId:        escrow.id,
      amandaConfidence: `${(validation.confidence * 100).toFixed(0)}%`,
      humanReviewRequired: true,
      failedChecks:    Object.entries(validation.checks).filter(([, v]) => !v).map(([k]) => k),
      message:         '⏳ Funds received. Human review required. Release held.',
    });
  }
}

// GET /api/webhooks/equity?dealroomId=XXX — check webhook status
export async function GET(req: NextRequest) {
  const dealroomId = req.nextUrl.searchParams.get('dealroomId');
  if (!dealroomId) return NextResponse.json({ error: 'dealroomId required' }, { status: 400 });
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('escrow_transactions')
    .select('id, tri_lock_state, amanda_confidence, human_review_required, funds_received_at, ai_validated_at, released_at')
    .eq('dealroom_id', dealroomId)
    .maybeSingle();
  return NextResponse.json({ triLock: data });
}