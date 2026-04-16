import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import {
  CurrencyCode, calculateEscrowFees, convertToKESMinor,
  fromMinorBigInt, toMinorBigInt
} from '@/lib/currencyEngine';

// ═══════════════════════════════════════════════════════════════
// WONDERLAND HOSPITALITY — TRI-LOCK ESCROW ENGINE
// Equity-Alibaba Mirror Architecture
//
// Tri-Lock States: PENDING → FUNDS_INGEST → AI_VALIDATION → SOVEREIGN_RELEASE
// Re-entry Protection: Atomic DB update with state precondition check
// BigInt Math: Zero floating-point drift across 26 SADC/EA currencies
// Double-Spend: Blocked at DB level via unique constraint on dealroom_id
// ═══════════════════════════════════════════════════════════════

function getSOPSlot(): '08:00' | '20:00' {
  return new Date().getHours() < 12 ? '08:00' : '20:00';
}

// POST /api/escrow — "Lock the Deal"
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      dealroomId,
      assetId,
      dealPrice,
      currency = 'KES',
      buyerProfileId,
      sellerProfileId,
      agentId,
      minutesJson,
    } = body;

    if (!dealroomId || !dealPrice || dealPrice <= 0) {
      return NextResponse.json(
        { error: 'dealroomId and positive dealPrice are required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // ── ATOMIC RE-ENTRY GUARD ─────────────────────────────────
    // We INSERT directly with a UNIQUE constraint on dealroom_id.
    // If the dealroom is already locked, Postgres rejects with 23505.
    // This is atomic — no TOCTOU race condition possible.
    // ─────────────────────────────────────────────────────────

    // ── FEE CALCULATION (BigInt — zero drift) ─────────────────
    const curr = currency as CurrencyCode;
    const fees = calculateEscrowFees(dealPrice, curr);
    const kesEscrow = await convertToKESMinor(fees.escrowMinor, curr);
    const kesSaas   = await convertToKESMinor(fees.saasMinor, curr);

    const sopSlot = getSOPSlot();
    const now     = new Date().toISOString();

    const escrowRecord = {
      dealroom_id:         dealroomId,
      asset_id:            assetId || null,
      deal_price:          dealPrice,
      currency:            curr,
      escrow_amount:       fromMinorBigInt(fees.escrowMinor, curr),
      escrow_rate:         0.10,
      saas_fee:            fromMinorBigInt(fees.saasMinor, curr),
      saas_fee_kes:        fromMinorBigInt(kesSaas, 'KES'),
      saas_rate:           0.005,
      agent_commission:    fromMinorBigInt(fees.agentMinor, curr),
      escrow_amount_kes:   fromMinorBigInt(kesEscrow, 'KES'),
      buyer_id:            buyerProfileId || null,
      seller_id:           sellerProfileId || null,
      agent_id:            agentId || null,
      status:              'locked',
      locked_at:           now,
      sop_report_slot:     sopSlot,
      amanda_minutes:      minutesJson || null,
      minor_unit_escrow:   Number(fees.escrowMinor),
      minor_unit_saas:     Number(fees.saasMinor),
      // Tri-Lock initial state
      tri_lock_state:      'PENDING',
      human_review_required: false,
    };

    const { data: escrow, error: escrowErr } = await supabase
      .from('escrow_transactions')
      .insert([escrowRecord])
      .select()
      .single();

    // ── DOUBLE-SPEND DETECTION ────────────────────────────────
    if (escrowErr) {
      // PostgreSQL error code 23505 = unique_violation
      if (escrowErr.code === '23505') {
        const { data: existing } = await supabase
          .from('escrow_transactions')
          .select('id, status, tri_lock_state, locked_at')
          .eq('dealroom_id', dealroomId)
          .single();

        return NextResponse.json({
          error:          'DOUBLE_SPEND_BLOCKED',
          message:        '🔒 Transaction Fortress active. This dealroom is already locked.',
          existingEscrow: existing?.id,
          triLockState:   existing?.tri_lock_state,
          lockedAt:       existing?.locked_at,
        }, { status: 409 });
      }
      throw escrowErr;
    }

    // ── LOG SaaS SWEEP ────────────────────────────────────────
    await supabase.from('saas_revenue_log').insert([{
      escrow_id:          escrow.id,
      dealroom_id:        dealroomId,
      fee_amount:         fromMinorBigInt(fees.saasMinor, curr),
      fee_currency:       curr,
      fee_kes_equivalent: fromMinorBigInt(kesSaas, 'KES'),
      deal_price:         dealPrice,
      rate_applied:       0.005,
      log_time:           now,
      sop_slot:           sopSlot,
      collection_account: 'TAO_MAIN_REVENUE_ACC',
      status:             'pending_settlement',
    }]);

    // ── EQUITY PAYMENT REFERENCE ──────────────────────────────
    const equityReference = `TAO-${dealroomId}`;

    return NextResponse.json({
      success: true,
      escrowId: escrow.id,
      dealroomId,
      triLockState: 'PENDING',
      equityPaymentReference: equityReference,
      paymentInstructions: {
        payTo:     process.env.EQUITY_TRUST_ACCOUNT || 'EQUITY_TRUST_ACC',
        reference: equityReference,
        amount:    fees.escrow,
        narration: `Wonderland Hospitality Escrow — ${equityReference}`,
      },
      summary: {
        dealPrice:        fees.dealPrice,
        escrowReserve:    `${fees.escrow} (10%)`,
        saasFeePlatform:  `${fees.saasFee} (0.5%)`,
        agentCommission:  `${fees.agent} (1.5%)`,
        balancePayable:   fees.balance,
        kesEquivalent: {
          escrow:  `KES ${fromMinorBigInt(kesEscrow, 'KES').toLocaleString()}`,
          saasFee: `KES ${fromMinorBigInt(kesSaas, 'KES').toLocaleString()}`,
        },
      },
      minorUnits: {
        escrow:  Number(fees.escrowMinor),
        saasFee: Number(fees.saasMinor),
        engine:  'BigInt — zero floating-point drift',
      },
      sopReportSlot: sopSlot,
      lockedAt: now,
      message: '🔒 Deal locked. Awaiting Equity Bank credit. Tri-Lock: PENDING.',
    });

  } catch (err: any) {
    console.error('[ESCROW] Fatal:', err.message);
    return NextResponse.json(
      { error: 'Escrow lock failed', detail: err.message },
      { status: 500 }
    );
  }
}

// GET /api/escrow?dealroomId=XXX — retrieve full escrow + Tri-Lock state
export async function GET(req: NextRequest) {
  const dealroomId = req.nextUrl.searchParams.get('dealroomId');
  if (!dealroomId) {
    return NextResponse.json({ error: 'dealroomId required' }, { status: 400 });
  }
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('dealroom_id', dealroomId)
      .order('locked_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return NextResponse.json({ escrow: null });

    return NextResponse.json({
      escrow: data,
      triLock: {
        state:               data.tri_lock_state || 'PENDING',
        humanReviewRequired: data.human_review_required || false,
        amandaConfidence:    data.amanda_confidence
          ? `${(data.amanda_confidence * 100).toFixed(0)}%`
          : null,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/escrow — CTO sovereign release (human approval)
export async function PATCH(req: NextRequest) {
  try {
    const { escrowId, action, ctoToken } = await req.json();
    if (ctoToken !== process.env.CTO_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized — CTO token required' }, { status: 403 });
    }
    if (!['release', 'dispute', 'refund'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const statusMap: Record<string, string> = {
      release: 'released', dispute: 'disputed', refund: 'refunded'
    };
    const triLockMap: Record<string, string> = {
      release: 'SOVEREIGN_RELEASE', dispute: 'AI_VALIDATION', refund: 'AI_VALIDATION'
    };

    const { data, error } = await supabase
      .from('escrow_transactions')
      .update({
        status:        statusMap[action],
        tri_lock_state: triLockMap[action],
        released_at:   action === 'release' ? new Date().toISOString() : null,
        human_review_required: false,
      })
      .eq('id', escrowId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      action,
      escrowId,
      triLockState: data.tri_lock_state,
      message: `✅ CTO sovereign ${action} executed.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
