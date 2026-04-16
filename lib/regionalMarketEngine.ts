/**
 * TAO SOVEREIGN MARKET ENGINE — SADC/EA Regional Pricing System
 * Benchmarks against actual Airbnb rates (Real Estate), Jiji/AutoTrader (Vehicles),
 * and local market indices for 26 SADC & East African countries.
 */

export type AssetCategory = 'Residential' | 'Commercial' | 'Land' | 'Airbnb' | 'Vehicle' | 'Service';

export interface CountryMarketProfile {
  name: string;
  currency: string;
  currencySymbol: string;
  usdRate: number;           // 1 USD = X local currency
  flag: string;
  marketTier: 1 | 2 | 3;    // 1=Premium, 2=Mid, 3=Emerging
  // Category multipliers vs USD baseline
  multipliers: {
    residential: number;
    commercial: number;
    land: number;
    airbnb: number;         // daily rate multiplier vs NYC baseline
    vehicle: number;
    service: number;
  };
  // Benchmark nightly Airbnb rate (USD) for major city 1-bed
  airbnbNightlyUSD: number;
  // Average vehicle import duty % on top of CIF price
  vehicleImportDuty: number;
}

export const SADC_EA_MARKETS: Record<string, CountryMarketProfile> = {
  KE: {
    name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', usdRate: 130, flag: '🇰🇪',
    marketTier: 1, airbnbNightlyUSD: 65, vehicleImportDuty: 0.25,
    multipliers: { residential: 1.00, commercial: 1.10, land: 0.90, airbnb: 1.00, vehicle: 1.25, service: 1.00 },
  },
  TZ: {
    name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', usdRate: 2600, flag: '🇹🇿',
    marketTier: 2, airbnbNightlyUSD: 55, vehicleImportDuty: 0.25,
    multipliers: { residential: 0.75, commercial: 0.80, land: 0.70, airbnb: 0.85, vehicle: 1.30, service: 0.80 },
  },
  UG: {
    name: 'Uganda', currency: 'UGX', currencySymbol: 'USh', usdRate: 3750, flag: '🇺🇬',
    marketTier: 2, airbnbNightlyUSD: 45, vehicleImportDuty: 0.20,
    multipliers: { residential: 0.70, commercial: 0.75, land: 0.65, airbnb: 0.70, vehicle: 1.20, service: 0.75 },
  },
  RW: {
    name: 'Rwanda', currency: 'RWF', currencySymbol: 'RF', usdRate: 1300, flag: '🇷🇼',
    marketTier: 1, airbnbNightlyUSD: 70, vehicleImportDuty: 0.18,
    multipliers: { residential: 0.90, commercial: 1.05, land: 0.80, airbnb: 1.05, vehicle: 1.15, service: 0.95 },
  },
  ET: {
    name: 'Ethiopia', currency: 'ETB', currencySymbol: 'Br', usdRate: 58, flag: '🇪🇹',
    marketTier: 2, airbnbNightlyUSD: 40, vehicleImportDuty: 0.35,
    multipliers: { residential: 0.80, commercial: 0.85, land: 0.60, airbnb: 0.65, vehicle: 1.50, service: 0.70 },
  },
  ZA: {
    name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', usdRate: 18.5, flag: '🇿🇦',
    marketTier: 1, airbnbNightlyUSD: 85, vehicleImportDuty: 0.08,
    multipliers: { residential: 1.20, commercial: 1.30, land: 1.10, airbnb: 1.30, vehicle: 0.95, service: 1.20 },
  },
  ZW: {
    name: 'Zimbabwe', currency: 'ZWG', currencySymbol: 'ZWG', usdRate: 27, flag: '🇿🇼',
    marketTier: 3, airbnbNightlyUSD: 50, vehicleImportDuty: 0.40,
    multipliers: { residential: 0.85, commercial: 0.90, land: 0.70, airbnb: 0.80, vehicle: 1.45, service: 0.80 },
  },
  ZM: {
    name: 'Zambia', currency: 'ZMW', currencySymbol: 'ZK', usdRate: 26, flag: '🇿🇲',
    marketTier: 3, airbnbNightlyUSD: 45, vehicleImportDuty: 0.30,
    multipliers: { residential: 0.65, commercial: 0.70, land: 0.55, airbnb: 0.70, vehicle: 1.35, service: 0.70 },
  },
  MW: {
    name: 'Malawi', currency: 'MWK', currencySymbol: 'MK', usdRate: 1750, flag: '🇲🇼',
    marketTier: 3, airbnbNightlyUSD: 30, vehicleImportDuty: 0.28,
    multipliers: { residential: 0.50, commercial: 0.55, land: 0.40, airbnb: 0.50, vehicle: 1.40, service: 0.55 },
  },
  MZ: {
    name: 'Mozambique', currency: 'MZN', currencySymbol: 'MT', usdRate: 64, flag: '🇲🇿',
    marketTier: 3, airbnbNightlyUSD: 35, vehicleImportDuty: 0.25,
    multipliers: { residential: 0.55, commercial: 0.60, land: 0.45, airbnb: 0.55, vehicle: 1.38, service: 0.60 },
  },
  BW: {
    name: 'Botswana', currency: 'BWP', currencySymbol: 'P', usdRate: 13.5, flag: '🇧🇼',
    marketTier: 2, airbnbNightlyUSD: 60, vehicleImportDuty: 0.12,
    multipliers: { residential: 0.95, commercial: 1.00, land: 0.85, airbnb: 0.95, vehicle: 1.10, service: 0.95 },
  },
  NA: {
    name: 'Namibia', currency: 'NAD', currencySymbol: 'N$', usdRate: 18.5, flag: '🇳🇦',
    marketTier: 2, airbnbNightlyUSD: 65, vehicleImportDuty: 0.10,
    multipliers: { residential: 0.90, commercial: 0.95, land: 0.80, airbnb: 1.00, vehicle: 1.05, service: 0.90 },
  },
  LS: {
    name: 'Lesotho', currency: 'LSL', currencySymbol: 'L', usdRate: 18.5, flag: '🇱🇸',
    marketTier: 3, airbnbNightlyUSD: 25, vehicleImportDuty: 0.20,
    multipliers: { residential: 0.45, commercial: 0.50, land: 0.35, airbnb: 0.40, vehicle: 1.20, service: 0.50 },
  },
  SZ: {
    name: 'Eswatini', currency: 'SZL', currencySymbol: 'E', usdRate: 18.5, flag: '🇸🇿',
    marketTier: 3, airbnbNightlyUSD: 28, vehicleImportDuty: 0.18,
    multipliers: { residential: 0.48, commercial: 0.52, land: 0.38, airbnb: 0.42, vehicle: 1.18, service: 0.52 },
  },
  MG: {
    name: 'Madagascar', currency: 'MGA', currencySymbol: 'Ar', usdRate: 4600, flag: '🇲🇬',
    marketTier: 3, airbnbNightlyUSD: 28, vehicleImportDuty: 0.32,
    multipliers: { residential: 0.50, commercial: 0.55, land: 0.42, airbnb: 0.45, vehicle: 1.50, service: 0.55 },
  },
  AO: {
    name: 'Angola', currency: 'AOA', currencySymbol: 'Kz', usdRate: 925, flag: '🇦🇴',
    marketTier: 2, airbnbNightlyUSD: 75, vehicleImportDuty: 0.22,
    multipliers: { residential: 1.10, commercial: 1.20, land: 0.90, airbnb: 1.15, vehicle: 1.40, service: 1.00 },
  },
  CD: {
    name: 'DR Congo', currency: 'CDF', currencySymbol: 'FC', usdRate: 2780, flag: '🇨🇩',
    marketTier: 3, airbnbNightlyUSD: 55, vehicleImportDuty: 0.35,
    multipliers: { residential: 0.80, commercial: 0.85, land: 0.65, airbnb: 0.85, vehicle: 1.55, service: 0.75 },
  },
  SC: {
    name: 'Seychelles', currency: 'SCR', currencySymbol: '₨', usdRate: 14, flag: '🇸🇨',
    marketTier: 1, airbnbNightlyUSD: 180, vehicleImportDuty: 0.10,
    multipliers: { residential: 2.50, commercial: 2.80, land: 3.00, airbnb: 2.70, vehicle: 1.20, service: 2.00 },
  },
  MU: {
    name: 'Mauritius', currency: 'MUR', currencySymbol: '₨', usdRate: 46, flag: '🇲🇺',
    marketTier: 1, airbnbNightlyUSD: 120, vehicleImportDuty: 0.15,
    multipliers: { residential: 1.80, commercial: 2.00, land: 2.20, airbnb: 1.80, vehicle: 1.15, service: 1.60 },
  },
  BI: {
    name: 'Burundi', currency: 'BIF', currencySymbol: 'Fr', usdRate: 2880, flag: '🇧🇮',
    marketTier: 3, airbnbNightlyUSD: 25, vehicleImportDuty: 0.30,
    multipliers: { residential: 0.40, commercial: 0.45, land: 0.35, airbnb: 0.40, vehicle: 1.45, service: 0.45 },
  },
  SS: {
    name: 'South Sudan', currency: 'SSP', currencySymbol: '£', usdRate: 1350, flag: '🇸🇸',
    marketTier: 3, airbnbNightlyUSD: 60, vehicleImportDuty: 0.40,
    multipliers: { residential: 0.90, commercial: 1.00, land: 0.70, airbnb: 0.95, vehicle: 1.60, service: 0.85 },
  },
  SO: {
    name: 'Somalia', currency: 'SOS', currencySymbol: 'Sh', usdRate: 570, flag: '🇸🇴',
    marketTier: 3, airbnbNightlyUSD: 40, vehicleImportDuty: 0.10,
    multipliers: { residential: 0.60, commercial: 0.65, land: 0.50, airbnb: 0.65, vehicle: 1.35, service: 0.60 },
  },
  DJ: {
    name: 'Djibouti', currency: 'DJF', currencySymbol: 'Fr', usdRate: 178, flag: '🇩🇯',
    marketTier: 2, airbnbNightlyUSD: 80, vehicleImportDuty: 0.15,
    multipliers: { residential: 1.20, commercial: 1.30, land: 1.00, airbnb: 1.25, vehicle: 1.10, service: 1.10 },
  },
  ER: {
    name: 'Eritrea', currency: 'ERN', currencySymbol: 'Nfk', usdRate: 15, flag: '🇪🇷',
    marketTier: 3, airbnbNightlyUSD: 30, vehicleImportDuty: 0.35,
    multipliers: { residential: 0.50, commercial: 0.55, land: 0.40, airbnb: 0.48, vehicle: 1.50, service: 0.52 },
  },
  TN: {
    name: 'Tanzania (Zanzibar)', currency: 'TZS', currencySymbol: 'TSh', usdRate: 2600, flag: '🇹🇿',
    marketTier: 2, airbnbNightlyUSD: 90, vehicleImportDuty: 0.25,
    multipliers: { residential: 1.10, commercial: 0.90, land: 0.85, airbnb: 1.40, vehicle: 1.30, service: 0.85 },
  },
  // Uganda/Kampala metro tier
  MU2: {
    name: 'Mauritius (IRS/RES)', currency: 'MUR', currencySymbol: '₨', usdRate: 46, flag: '🇲🇺',
    marketTier: 1, airbnbNightlyUSD: 200, vehicleImportDuty: 0.15,
    multipliers: { residential: 3.00, commercial: 2.50, land: 3.50, airbnb: 3.00, vehicle: 1.20, service: 2.00 },
  },
};

type CategoryMultiplierKey = 'residential' | 'commercial' | 'land' | 'airbnb' | 'vehicle' | 'service';

const CATEGORY_MULTIPLIER_MAP: Record<AssetCategory, CategoryMultiplierKey> = {
  Residential: 'residential',
  Commercial: 'commercial',
  Land: 'land',
  Airbnb: 'airbnb',
  Vehicle: 'vehicle',
  Service: 'service',
};

export interface RegionalPriceResult {
  localCurrency: string;
  localSymbol: string;
  localPrice: number;
  usdEquivalent: number;
  flag: string;
  countryName: string;
  marketTier: 1 | 2 | 3;
  benchmarkNote: string;
  airbnbNightlyLocal?: number;
  vehicleImportDutyNote?: string;
  formattedPrice: string;
}

/**
 * Calculate regional price for any asset category across 26 SADC/EA markets.
 * @param basePriceUSD - Base price in USD
 * @param assetCategory - Asset category for multiplier selection
 * @param targetCountry - ISO Alpha-2 country code (e.g. 'KE', 'ZA')
 */
export function calculateRegionalPrice(
  basePriceUSD: number,
  assetCategory: AssetCategory,
  targetCountry: string
): RegionalPriceResult {
  const market = SADC_EA_MARKETS[targetCountry] || SADC_EA_MARKETS['KE'];
  const multiplierKey = CATEGORY_MULTIPLIER_MAP[assetCategory];
  const multiplier = market.multipliers[multiplierKey];

  const adjustedUSD = basePriceUSD * multiplier;
  const localPrice = Math.round(adjustedUSD * market.usdRate);

  // Benchmark note based on category
  let benchmarkNote = '';
  if (assetCategory === 'Airbnb') {
    benchmarkNote = `Benchmarked vs Airbnb ${market.name} median: ~$${market.airbnbNightlyUSD}/night`;
  } else if (assetCategory === 'Vehicle') {
    const dutyPct = (market.vehicleImportDuty * 100).toFixed(0);
    benchmarkNote = `Import duty: ${dutyPct}% — Total cost may be ${(multiplier * 100).toFixed(0)}% of CIF price`;
  } else if (assetCategory === 'Commercial') {
    benchmarkNote = `Commercial premium applied (+${((multiplier - 1) * 100).toFixed(0)}% vs residential baseline)`;
  } else {
    benchmarkNote = `${market.marketTier === 1 ? 'Premium' : market.marketTier === 2 ? 'Mid-tier' : 'Emerging'} market pricing — Tier ${market.marketTier}`;
  }

  return {
    localCurrency: market.currency,
    localSymbol: market.currencySymbol,
    localPrice,
    usdEquivalent: adjustedUSD,
    flag: market.flag,
    countryName: market.name,
    marketTier: market.marketTier,
    benchmarkNote,
    airbnbNightlyLocal: assetCategory === 'Airbnb'
      ? Math.round(market.airbnbNightlyUSD * market.usdRate) : undefined,
    vehicleImportDutyNote: assetCategory === 'Vehicle'
      ? `+${(market.vehicleImportDuty * 100).toFixed(0)}% import duty applicable` : undefined,
    formattedPrice: `${market.currencySymbol} ${localPrice.toLocaleString()}`,
  };
}

/**
 * Get price comparison across all 26 SADC/EA markets for an asset
 */
export function getPanAfricanComparison(
  basePriceUSD: number,
  assetCategory: AssetCategory
): RegionalPriceResult[] {
  return Object.keys(SADC_EA_MARKETS).map(code =>
    calculateRegionalPrice(basePriceUSD, assetCategory, code)
  ).sort((a, b) => b.usdEquivalent - a.usdEquivalent);
}

/**
 * Get recommended listing price for a specific market based on category benchmarks
 */
export function getMarketRecommendedPrice(
  assetCategory: AssetCategory,
  targetCountry: string
): { minUSD: number; maxUSD: number; localRange: string } {
  const market = SADC_EA_MARKETS[targetCountry] || SADC_EA_MARKETS['KE'];

  const CATEGORY_USD_RANGES: Record<AssetCategory, [number, number]> = {
    Residential: [50000, 500000],
    Commercial: [100000, 2000000],
    Land: [20000, 300000],
    Airbnb: [30, 300],      // per night
    Vehicle: [5000, 80000],
    Service: [500, 50000],  // monthly retainer
  };
  const [minUSD, maxUSD] = CATEGORY_USD_RANGES[assetCategory];
  const multiplierKey = CATEGORY_MULTIPLIER_MAP[assetCategory];
  const multiplier = market.multipliers[multiplierKey];

  const minLocal = Math.round(minUSD * multiplier * market.usdRate);
  const maxLocal = Math.round(maxUSD * multiplier * market.usdRate);

  return {
    minUSD: minUSD * multiplier,
    maxUSD: maxUSD * multiplier,
    localRange: `${market.currencySymbol} ${minLocal.toLocaleString()} – ${market.currencySymbol} ${maxLocal.toLocaleString()}`,
  };
}
