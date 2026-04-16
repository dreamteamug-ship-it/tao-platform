// Wonderland Hospitality — Patient Recovery Engine
export type RecoveryStatus = 'GREEN' | 'BLUE' | 'RED';

export type SOPAction = 'MORATORIUM' | 'TRADE_IN' | 'BUY_OFF' | 'RESCHEDULING' | 'ESCALATE';

export interface PatientScoreResult {
  assetId: string;
  rawScore: number;
  adjustedScore: number;
  status: RecoveryStatus;
  pinColor: 'blue' | 'red' | 'green';
  sopPath: SOPAction[];
  moratoriumDays: number;
  tradeInEligible: boolean;
  buyOffEligible: boolean;
  escalateHuman: boolean;
  narrative: string;
}

export interface PatientScoreInput {
  assetId: string;
  paymentHistory: number;
  iotTelemetry: number;
  marketValue: number;
  riskIndex: number;
  country: string;
  currency: string;
}

const COUNTRY_RISK: Record<string, number> = {
  KE:1.0, TZ:1.1, UG:1.2, RW:0.9, ET:1.4, ZA:1.0, ZM:1.3, BW:0.8,
  NA:0.9, MZ:1.5, AO:1.6, MG:1.7, MU:0.7, GH:1.1, NG:1.5, ZW:1.8,
  SC:0.7, DJ:1.3, ER:1.9, SS:2.0, SD:1.9, SO:2.0, CD:1.8, BI:1.7,
  LS:1.1, SZ:1.1, MW:1.6,
};

export function calculatePatientScore(input: PatientScoreInput): PatientScoreResult {
  const { paymentHistory, iotTelemetry, marketValue, country, assetId } = input;
  const raw = (paymentHistory * 0.4) + (iotTelemetry * 0.3) + (marketValue * 0.3);
  const R = COUNTRY_RISK[country] ?? input.riskIndex ?? 1.0;
  const adjusted = Math.min(100, raw / R);

  const status: RecoveryStatus = adjusted >= 75 ? 'GREEN' : adjusted >= 50 ? 'BLUE' : 'RED';
  const pinColor = status === 'GREEN' ? 'green' : status === 'BLUE' ? 'blue' : 'red';

  const sopPath: SOPAction[] =
    status === 'RED'  ? ['MORATORIUM','RESCHEDULING','ESCALATE'] :
    status === 'BLUE' ? ['MORATORIUM','TRADE_IN'] :
                        ['TRADE_IN','BUY_OFF'];

  return {
    assetId,
    rawScore: Math.round(raw * 10) / 10,
    adjustedScore: Math.round(adjusted * 10) / 10,
    status, pinColor, sopPath,
    moratoriumDays: status === 'RED' ? 90 : status === 'BLUE' ? 60 : 30,
    tradeInEligible: adjusted >= 50,
    buyOffEligible: adjusted >= 75,
    escalateHuman: status === 'RED',
    narrative:
      status === 'GREEN' ? `Asset ${assetId}: Sovereign grade. Buy-off eligible.` :
      status === 'BLUE'  ? `Asset ${assetId}: 60-day moratorium. Amanda monitoring.` :
                           `Asset ${assetId}: 90-day moratorium. Human review required.`,
  };
}

export const RECOVERY_SOP_LABELS: Record<SOPAction, string> = {
  MORATORIUM:   '📅 3-Month Moratorium',
  TRADE_IN:     '🔄 Trade-In Facilitation',
  BUY_OFF:      '💰 Strategic Buy-Off',
  RESCHEDULING: '📋 Payment Rescheduling',
  ESCALATE:     '🚨 Human Escalation Required',
};

// Settlement map — Djibouti bridge included
export const SETTLEMENT_MAP: Record<string, string> = {
  KE: 'MPESA_400200', TZ: 'MPESA_TZ', UG: 'AIRTEL_UG', RW: 'MOMO_RW',
  ZA: 'STRIPE_ZA', GH: 'MOMO_GH', NG: 'FLUTTERWAVE_NG',
  DJ: 'ALTOVEX_400200', // Djibouti Bridge → Paybill 400200 / Acc 4045731
  DEFAULT: 'ALTOVEX_400200',
};