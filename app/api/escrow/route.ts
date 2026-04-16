import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────
// TAO ESCROW LOCK ENGINE
// - 10% Reserve fee calculation
// - 0.5% SaaS fee auto-routed to platform collection account
// - Logged for 8:00 AM / 8:00 PM Amanda SOP reports
// - Supports SADC/EA minor-unit currency conversions
// ─────────────────────────────────────────────────────────────

// SADC/EA currency minor unit definitions (decimal places)
const CURRENCY_MINOR_UNITS: Record<string, number> = {
  KES: 2, // Kenyan Shilling
  TZS: 2, // Tanzanian Shilling
  UGX: 0, // Ugandan Shilling (no decimals)
  RWF: 0, // Rwandan Franc (no decimals)
  ETB: 2, // Ethiopian Birr
  ZAR: 2, // South African Rand
  ZWL: 2, // Zimbabwe Dollar
  ZMW: 2, // Zambian Kwacha
  BWP: 2, // Botswana Pula
  NAD: 2, // Namibian Dollar
  MUR: 2, // Mauritian Rupee
  USD: 2, // US Dollar (for Seychelles/DRC/Djibouti)
  EUR: 2, // Euro
};

// Live FX rates relative to KES (update via cron in production)
const FX_TO_KES: Record<string, number> = {
  KES: 1,
  TZS: 0.044,
  UGX: 0.037,
  RWF: 0.11,
  ETB: 1.85,
  ZAR: 7.2,
  ZWL: 0.016,
  ZMW: 7.8,
  BWP: 9.6,
  NAD: 7.2,
  MUR: 2.8,
  USD: 129.5,
  EUR: 140.2,
};

function toMinorUnits(amount: number, currency: string): number {
  const decimals = CURRENCY_MINOR_UNITS[currency] ?? 2;
  return Math.round(amount * Math.pow(10, decimals));
}

function fromMinorUnits(minor: number, currency: string): number {
  const decimals = CURRENCY_MINOR_UNITS[currency] ?? 2;
  return minor / Math.pow(10, decimals);
}

function convertToKES(amount: number, currency: string): number {
  const rate = FX_TO_KES[currency] || 1;
  return amount * rate;
}

function getSOPReportSlot(): '08:00' | '20:00' {
  const hour = new Date().getHours();
  return hour < 12 ? '08:00' : '20:00';
}

// POST /api/escrow — "Lock the Deal"
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      dealroomId,
      assetId,
      dealPrice,       // raw amount in asset currency
      currency = 'KES',
      buyerProfileId,
      sellerProfileId,
      agentId,
      minutesJson,     // Amanda SOP minutes JSON
    } = body;

    if (!dealroomId || !dealPrice || dealPrice <= 0) {
      return NextResponse.json({ error: 'dealroomId and positive dealPrice are required' }, { status: 400 });
    }

    // ── Fee Calculations ──────────────────────────────────────
    const escrowReserveRate = 0.10;   // 10% reserve
    const saasRate = 0.005;           // 0.5% SaaS fee
    const agentRate = 0.015;          // 1.5% agent commission (informational)

    const escrowMinor = toMinorUnits(dealPrice * escrowReserveRate, currency);
    const saasMinor   = toMinorUnits(dealPrice * saasRate, currency);
    const agentMinor  = toMinorUnits(dealPrice * agentRate, currency);

    const escrowAmount = fromMinorUnits(escrowMinor, currency);
    const saasAmount   = fromMinorUnits(saasMinor, currency);
    const agentAmount  = fromMinorUnits(agentMinor, currency);

    // Convert to KES for cross-border standardised logging
    const escrowKES = convertToKES(escrowAmount, currency);
    const saasKES   = convertToKES(saasAmount, currency);

    // ── Write to Supabase ─────────────────────────────────────
    const supabase = createAdminClient();
    const sopSlot  = getSOPReportSlot();
    const now      = new Date().toISOString();

    const escrowRecord = {
      dealroom_id: dealroomId,
      asset_id: assetId || null,
      deal_price: dealPrice,
      currency,
      escrow_amount: escrowAmount,
      escrow_rate: escrowReserveRate,
      saas_fee: saasAmount,
      saas_fee_kes: saasKES,
      saas_rate: saasRate,
      agent_commission: agentAmount,
      escrow_amount_kes: escrowKES,
      buyer_id: buyerProfileId || null,
      seller_id: sellerProfileId || null,
      agent_id: agentId || null,
      status: 'locked',
      locked_at: now,
      sop_report_slot: sopSlot,
      amanda_minutes: minutesJson || null,
      minor_unit_escrow: escrowMinor,
      minor_unit_saas: saasMinor,
    };

    const { data: escrow, error: escrowErr } = await supabase
      .from('escrow_transactions')
      .insert([escrowRecord])
      .select()
      .single();

    if (escrowErr) throw escrowErr;

    // ── Log SaaS Fee for CTO Revenue Report ──────────────────
    await supabase.from('saas_revenue_log').insert([{
      escrow_id: escrow.id,
      dealroom_id: dealroomId,
      fee_amount: saasAmount,
      fee_currency: currency,
      fee_kes_equivalent: saasKES,
      deal_price: dealPrice,
      rate_applied: saasRate,
      log_time: now,
      sop_slot: sopSlot,
      collection_account: 'TAO_MAIN_REVENUE_ACC',
      status: 'pending_settlement',
    }]);

    // ── Response Payload ──────────────────────────────────────
    return NextResponse.json({
      success: true,
      escrowId: escrow.id,
      dealroomId,
      summary: {
        dealPrice: `${currency} ${dealPrice.toLocaleString()}`,
        escrowReserve: `${currency} ${escrowAmount.toLocaleString()} (10%)`,
        saasFeePlatform: `${currency} ${saasAmount.toLocaleString()} (0.5%)`,
        agentCommission: `${currency} ${agentAmount.toLocaleString()} (1.5%)`,
        balancePayable: `${currency} ${(dealPrice - escrowAmount).toLocaleString()}`,
        crossBorderKES: {
          escrow: `KES ${Math.round(escrowKES).toLocaleString()}`,
          saasFee: `KES ${Math.round(saasKES).toLocaleString()}`,
        },
      },
      minorUnits: {
        escrow: escrowMinor,
        saasFee: saasMinor,
        currency,
        decimals: CURRENCY_MINOR_UNITS[currency] ?? 2,
      },
      sopReportSlot: sopSlot,
      lockedAt: now,
      message: '🔒 Deal locked. Amanda SOP report scheduled. TAO SaaS fee routed.',
    });

  } catch (err: any) {
    console.error('[ESCROW] Fatal:', err.message);
    return NextResponse.json({ error: 'Escrow lock failed', detail: err.message }, { status: 500 });
  }
}

// GET /api/escrow?dealroomId=XXX — retrieve escrow status
export async function GET(req: NextRequest) {
  const dealroomId = req.nextUrl.searchParams.get('dealroomId');
  if (!dealroomId) return NextResponse.json({ error: 'dealroomId required' }, { status: 400 });

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
    return NextResponse.json({ escrow: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
