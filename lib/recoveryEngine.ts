// ═══════════════════════════════════════════════════════════════
// WONDERLAND HOSPITALITY — PATIENT RECOVERY ENGINE
// Replaces the auctioneer's gavel with the Architect's compassion
// Formula: S = (P×0.4 + T×0.3 + V×0.3) / R
// ═══════════════════════════════════════════════════════════════

export type RecoveryStatus = 'GREEN' | 'BLUE' | 'RED';

export interface PatientScoreInput {
  paymentHistory:    number;  // P: 0-100 (Equity Bank automated ingest)
  iotTelemetry:      number;  // T: 0-100 (live asset GPS/condition tracking)
  marketValue:       number;  // V: 0-100 (OpenCrawl dynamic pricing index)
  riskIndex:         number;  // R: 0.5-2.0 (regional SADC stability factor)
  country:           string;  // ISO2 country code
  assetId:           string;
  currency:          string;
}

export interface PatientScoreResult {
  assetId:       string;
  rawScore:      number;      // before risk adjustment
  adjustedScore: number;      // S = raw / R
  status:        RecoveryStatus;
  pinColor:      'blue' | 'red' | 'green';
  sopPath:       SOPAction[];
  moratoriumDays: number;     // 3-month default
  tradeInEligible: boolean;
  buyOffEligible:  boolean;
  escalateHuman:   boolean;
  narrative:       string;
}

export type SOPAction = 'MORATORIUM' | 'TRADE_IN' | 'BUY_OFF' | 'RESCHEDULING' | 'ESCALATE';

// SADC Risk Index by country (1.0 = stable, 2.0 = high risk)
const COUNTRY_RISK_INDEX: Record<string, number> = {
  KE: 1.0, TZ: 1.1, UG: 1.2, RW: 0.9, ET: 1.4, ZA: 1.0,
  ZM: 1.3, BW: 0.8, NA: 0.9, MZ: 1.5, AO: 1.6, MG: 1.7,
  MU: 0.7, GH: 1.1, NG: 1.5, ZW: 1.8, SC: 0.7, DJ: 1.3,
  ER: 1.9, SS: 2.0, SD: 1.9, SO: 2.0, MWK: 1.6, LS: 1.1,
  SZ: 1.1, CD: 1.8, BI: 1.7,
};

export function calculatePatientScore(input: PatientScoreInput): PatientScoreResult {
  const { paymentHistory, iotTelemetry, marketValue, country, assetId } = input;

  // Weighted composite score
  const rawScore = (paymentHistory * 0.4) + (iotTelemetry * 0.3) + (marketValue * 0.3);

  // Risk-adjusted score
  const R = COUNTRY_RISK_INDEX[country] || input.riskIndex || 1.0;
  const adjustedScore = Math.min(100, rawScore / R);

  // Status classification
  let status: RecoveryStatus;
  if      (adjustedScore >= 75) status = 'GREEN';
  else if (adjustedScore >= 50) status = 'BLUE';
  else                          status = 'RED';

  const pinColor = status === 'GREEN' ? 'green' : status === 'BLUE' ? 'blue' : 'red';

  // SOP path determination
  const sopPath: SOPAction[] = [];
  if (status === 'RED') {
    sopPath.push('MORATORIUM', 'RESCHEDULING', 'ESCALATE');
  } else if (status === 'BLUE') {
    sopPath.push('MORATORIUM', 'TRADE_IN');
    if (adjustedScore < 60) sopPath.push('RESCHEDULING');
  } else {
    sopPath.push('TRADE_IN', 'BUY_OFF');
  }

  const moratoriumDays = status === 'RED' ? 90 : status === 'BLUE' ? 60 : 30;

  const narrativeMap: Record<RecoveryStatus, string> = {
    GREEN: `Asset ${assetId} is performing at sovereign grade. Trade-in or strategic buy-off recommended to unlock capital for next acquisition.`,
    BLUE:  `Asset ${assetId} requires a 60-day moratorium protocol. Amanda AI is monitoring telemetry for recovery trajectory. No auctioneer intervention.`,
    RED:   `Asset ${assetId} is in escalation. 90-day moratorium activated. Human review required. Alternative: SADC cross-border trade facilitation.`,
  };

  return {
    assetId,
    rawScore: Math.round(rawScore * 10) / 10,
    adjustedScore: Math.round(adjustedScore * 10) / 10,
    status,
    pinColor,
    sopPath,
    moratoriumDays,
    tradeInEligible: adjustedScore >= 50,
    buyOffEligible:  adjustedScore >= 75,
    escalateHuman:   status === 'RED',
    narrative: narrativeMap[status],
  };
}

export const RECOVERY_SOP_LABELS: Record<SOPAction, string> = {
  MORATORIUM:   '📅 3-Month Moratorium',
  TRADE_IN:     '🔄 Trade-In Facilitation',
  BUY_OFF:      '💰 Strategic Buy-Off',
  RESCHEDULING: '📋 Payment Rescheduling',
  ESCALATE:     '🚨 Human Escalation Required',
};