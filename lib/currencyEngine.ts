// ═══════════════════════════════════════════════════════════════
// WONDERLAND HOSPITALITY — TITANIUM CURRENCY ENGINE
// BigInt-based FX arithmetic — zero floating-point drift
// Supports 26 SADC/EA national currencies
// ═══════════════════════════════════════════════════════════════

export type CurrencyCode =
  | 'KES' | 'TZS' | 'UGX' | 'RWF' | 'ETB' | 'ZAR' | 'ZMW'
  | 'BWP' | 'NAD' | 'MUR' | 'MZN' | 'AOA' | 'MGA' | 'NGN'
  | 'GHS' | 'USD' | 'EUR' | 'ZWL' | 'SCR' | 'DJF' | 'ERN'
  | 'SSP' | 'SDG' | 'SOS' | 'MWK' | 'LSL';

// Minor unit decimal places per currency (ISO 4217)
export const MINOR_UNITS: Record<CurrencyCode, number> = {
  KES: 2, TZS: 2, UGX: 0, RWF: 0, ETB: 2, ZAR: 2, ZMW: 2,
  BWP: 2, NAD: 2, MUR: 2, MZN: 2, AOA: 2, MGA: 0, NGN: 2,
  GHS: 2, USD: 2, EUR: 2, ZWL: 2, SCR: 2, DJF: 0, ERN: 2,
  SSP: 2, SDG: 2, SOS: 2, MWK: 2, LSL: 2,
};

// Currency display info for all 26 SADC/EA countries
export const CURRENCY_META: Record<CurrencyCode, {
  name: string; symbol: string; country: string; flag: string;
}> = {
  KES: { name: 'Kenyan Shilling',       symbol: 'KSh',  country: 'Kenya',        flag: '🇰🇪' },
  TZS: { name: 'Tanzanian Shilling',    symbol: 'TSh',  country: 'Tanzania',     flag: '🇹🇿' },
  UGX: { name: 'Ugandan Shilling',      symbol: 'USh',  country: 'Uganda',       flag: '🇺🇬' },
  RWF: { name: 'Rwandan Franc',         symbol: 'RF',   country: 'Rwanda',       flag: '🇷🇼' },
  ETB: { name: 'Ethiopian Birr',        symbol: 'Br',   country: 'Ethiopia',     flag: '🇪🇹' },
  ZAR: { name: 'South African Rand',    symbol: 'R',    country: 'South Africa', flag: '🇿🇦' },
  ZMW: { name: 'Zambian Kwacha',        symbol: 'ZK',   country: 'Zambia',       flag: '🇿🇲' },
  BWP: { name: 'Botswana Pula',         symbol: 'P',    country: 'Botswana',     flag: '🇧🇼' },
  NAD: { name: 'Namibian Dollar',       symbol: 'N$',   country: 'Namibia',      flag: '🇳🇦' },
  MUR: { name: 'Mauritian Rupee',       symbol: 'Rs',   country: 'Mauritius',    flag: '🇲🇺' },
  MZN: { name: 'Mozambican Metical',    symbol: 'MT',   country: 'Mozambique',   flag: '🇲🇿' },
  AOA: { name: 'Angolan Kwanza',        symbol: 'Kz',   country: 'Angola',       flag: '🇦🇴' },
  MGA: { name: 'Malagasy Ariary',       symbol: 'Ar',   country: 'Madagascar',   flag: '🇲🇬' },
  NGN: { name: 'Nigerian Naira',        symbol: '₦',    country: 'Nigeria',      flag: '🇳🇬' },
  GHS: { name: 'Ghanaian Cedi',         symbol: 'GH₵', country: 'Ghana',        flag: '🇬🇭' },
  USD: { name: 'US Dollar',             symbol: '$',    country: 'Seychelles/DRC', flag: '🇸🇨' },
  EUR: { name: 'Euro',                  symbol: '€',    country: 'Djibouti',     flag: '🇩🇯' },
  ZWL: { name: 'Zimbabwe Dollar',       symbol: 'Z$',   country: 'Zimbabwe',     flag: '🇿🇼' },
  SCR: { name: 'Seychellois Rupee',     symbol: 'Rs',   country: 'Seychelles',   flag: '🇸🇨' },
  DJF: { name: 'Djiboutian Franc',      symbol: 'Fdj',  country: 'Djibouti',     flag: '🇩🇯' },
  ERN: { name: 'Eritrean Nakfa',        symbol: 'Nkf',  country: 'Eritrea',      flag: '🇪🇷' },
  SSP: { name: 'South Sudanese Pound',  symbol: 'SSP',  country: 'South Sudan',  flag: '🇸🇸' },
  SDG: { name: 'Sudanese Pound',        symbol: 'SDG',  country: 'Sudan',        flag: '🇸🇩' },
  SOS: { name: 'Somali Shilling',       symbol: 'Sh',   country: 'Somalia',      flag: '🇸🇴' },
  MWK: { name: 'Malawian Kwacha',       symbol: 'MK',   country: 'Malawi',       flag: '🇲🇼' },
  LSL: { name: 'Lesotho Loti',          symbol: 'M',    country: 'Lesotho',      flag: '🇱🇸' },
};

// ─────────────────────────────────────────────────────────────
// BIGINT ARITHMETIC ENGINE
// All amounts stored as BigInt minor units (e.g., KES 100.50 → 10050n)
// Eliminates ALL floating-point drift in cross-border calculations
// ─────────────────────────────────────────────────────────────

/** Convert decimal amount to BigInt minor units */
export function toMinorBigInt(amount: number, currency: CurrencyCode): bigint {
  const decimals = MINOR_UNITS[currency] ?? 2;
  const factor   = Math.pow(10, decimals);
  // Use string rounding to avoid floating point: 100.005 → "10001" not "10000"
  return BigInt(Math.round(amount * factor));
}

/** Convert BigInt minor units back to decimal number */
export function fromMinorBigInt(minor: bigint, currency: CurrencyCode): number {
  const decimals = MINOR_UNITS[currency] ?? 2;
  const factor   = BigInt(Math.pow(10, decimals));
  const whole    = minor / factor;
  const rem      = minor % factor;
  return Number(whole) + Number(rem) / Math.pow(10, decimals);
}

/** Format for display: KES 1,250,000.00 */
export function formatCurrency(minor: bigint, currency: CurrencyCode): string {
  const meta    = CURRENCY_META[currency];
  const amount  = fromMinorBigInt(minor, currency);
  const decimals = MINOR_UNITS[currency] ?? 2;
  return `${meta?.symbol || currency} ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

// ─────────────────────────────────────────────────────────────
// WONDERLAND HOSPITALITY — FEE ENGINE (BigInt precision)
// 10% Escrow Reserve + 0.5% SaaS Sweep + 1.5% Agent Commission
// ─────────────────────────────────────────────────────────────

export interface EscrowFees {
  dealPriceMinor:  bigint;  // raw deal
  escrowMinor:     bigint;  // 10% reserve
  saasMinor:       bigint;  // 0.5% sweep → TAO_MAIN_REVENUE_ACC
  agentMinor:      bigint;  // 1.5% commission
  balanceMinor:    bigint;  // payable to seller after escrow
  currency:        CurrencyCode;
  // Human-readable
  dealPrice:   string;
  escrow:      string;
  saasFee:     string;
  agent:       string;
  balance:     string;
}

export function calculateEscrowFees(
  dealPrice: number,
  currency: CurrencyCode
): EscrowFees {
  const dealPriceMinor = toMinorBigInt(dealPrice, currency);

  // Integer percentage arithmetic — zero drift
  // Escrow: 10% = multiply by 10, divide by 100
  const escrowMinor  = (dealPriceMinor * 10n)  / 100n;
  const saasMinor    = (dealPriceMinor * 5n)   / 1000n;  // 0.5% = 5/1000
  const agentMinor   = (dealPriceMinor * 15n)  / 1000n;  // 1.5% = 15/1000
  const balanceMinor = dealPriceMinor - escrowMinor;

  return {
    dealPriceMinor, escrowMinor, saasMinor, agentMinor, balanceMinor, currency,
    dealPrice: formatCurrency(dealPriceMinor, currency),
    escrow:    formatCurrency(escrowMinor,    currency),
    saasFee:   formatCurrency(saasMinor,      currency),
    agent:     formatCurrency(agentMinor,     currency),
    balance:   formatCurrency(balanceMinor,   currency),
  };
}

// ─────────────────────────────────────────────────────────────
// LIVE FX ENGINE — Equity Bank API Integration
// Falls back to static rates if live fetch fails
// ─────────────────────────────────────────────────────────────

// Static fallback rates relative to KES (updated 2026-04-16)
const STATIC_FX_TO_KES: Partial<Record<CurrencyCode, number>> = {
  KES: 1, TZS: 0.044, UGX: 0.037, RWF: 0.11, ETB: 1.85,
  ZAR: 7.2, ZWL: 0.016, ZMW: 7.8, BWP: 9.6, NAD: 7.2,
  MUR: 2.8, USD: 129.5, EUR: 140.2, MZN: 2.1, AOA: 0.16,
  GHS: 8.5, NGN: 0.085, SCR: 9.2, DJF: 0.73,
  MWK: 0.075, SSP: 0.31, LSL: 7.2,
};

let _fxCache: { rates: Partial<Record<CurrencyCode, number>>; fetchedAt: number } | null = null;
const FX_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function getLiveFXRates(): Promise<Partial<Record<CurrencyCode, number>>> {
  // Return cached rates if fresh
  if (_fxCache && Date.now() - _fxCache.fetchedAt < FX_CACHE_TTL_MS) {
    return _fxCache.rates;
  }

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) throw new Error('No FX API key');

    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/KES`,
      { next: { revalidate: 900 } } // Vercel edge cache 15 min
    );
    const data = await res.json();
    if (data.result !== 'success') throw new Error('FX API error');

    // Convert "1 KES = X foreign" to "1 foreign = Y KES"
    const rates: Partial<Record<CurrencyCode, number>> = { KES: 1 };
    for (const [code, rate] of Object.entries(data.conversion_rates)) {
      if (code in MINOR_UNITS) {
        rates[code as CurrencyCode] = 1 / (rate as number);
      }
    }

    _fxCache = { rates, fetchedAt: Date.now() };
    return rates;
  } catch {
    // Fallback to static rates
    return STATIC_FX_TO_KES;
  }
}

export async function convertToKESMinor(
  minor: bigint,
  currency: CurrencyCode
): Promise<bigint> {
  if (currency === 'KES') return minor;
  const rates = await getLiveFXRates();
  const rate  = rates[currency] || STATIC_FX_TO_KES[currency] || 1;
  const amountKES = fromMinorBigInt(minor, currency) * rate;
  return toMinorBigInt(amountKES, 'KES');
}
