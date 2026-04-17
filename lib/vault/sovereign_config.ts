// ═══════════════════════════════════════════════════════════════
// WONDERLAND HOSPITALITY — SOVEREIGN SETTLEMENT CONFIG
// Paybill 400200 · Acc: 4045731 · PayPal: altovexgl@gmail.com
// ⚠️  NEVER commit real keys — use Vercel env vars in production
// ═══════════════════════════════════════════════════════════════

export const SETTLEMENT = {
  MPESA_PAYBILL:    process.env.MPESA_PAYBILL    || '400200',
  MPESA_ACCOUNT:    process.env.MPESA_ACCOUNT    || '4045731',
  PAYPAL_EMAIL:     process.env.PAYPAL_EMAIL      || 'altovexgl@gmail.com',
  ALTOVEX_BANK:     'Altovex Global Logistics',
  JENGA_MERCHANT:   process.env.JENGA_MERCHANT_KEY || '',
  TELEGRAM_BOT:     process.env.TELEGRAM_BOT_TOKEN || '',
} as const;

// 27-country settlement routing map
export const COUNTRY_GATEWAY: Record<string, string> = {
  KE: 'MPESA_PAYBILL_400200',
  TZ: 'MPESA_TZ',
  UG: 'AIRTEL_MONEY_UG',
  RW: 'MOMO_RW',
  ZA: 'OZOW_ZA',
  GH: 'MOMO_GH',
  NG: 'FLUTTERWAVE_NG',
  ET: 'TELEBIRR_ET',
  ZM: 'AIRTEL_ZM',
  BW: 'ORANGE_BW',
  NA: 'BANK_TRANSFER_NA',
  MZ: 'MPESA_MZ',
  AO: 'UNITEL_AO',
  MG: 'MVOLA_MG',
  MU: 'JUICE_MU',
  SC: 'BANK_SC',
  DJ: 'MPESA_DJ_400200', // Djibouti → routes via Altovex 400200
  ZW: 'ECOCASH_ZW',
  LS: 'MPESA_LS',
  SZ: 'MPESA_SZ',
  MW: 'AIRTEL_MW',
  BI: 'LUMICASH_BI',
  CD: 'ORANGE_CD',
  SS: 'BANK_SS',
  SD: 'BANK_SD',
  ER: 'BANK_ER',
  SO: 'HORMUUD_SO',
  DEFAULT: 'ALTOVEX_PAYBILL_400200',
};

export const SAAS_FEE_BPS = 50n; // 0.50% in basis points (BigInt safe)
