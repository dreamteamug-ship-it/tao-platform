// SADC/EA Country Tax Rates & Tourism Levies
export const COUNTRY_TAX_CONFIG: Record<string, {
  vat: number; tourism: number; name: string; currency: string; symbol: string;
}> = {
  KE: { vat: 0.16,  tourism: 0.02,  name: 'Kenya',        currency: 'KES', symbol: 'KSh' },
  TZ: { vat: 0.18,  tourism: 0.015, name: 'Tanzania',     currency: 'TZS', symbol: 'TSh' },
  UG: { vat: 0.18,  tourism: 0.01,  name: 'Uganda',       currency: 'UGX', symbol: 'USh' },
  RW: { vat: 0.18,  tourism: 0.015, name: 'Rwanda',       currency: 'RWF', symbol: 'RF'  },
  ET: { vat: 0.15,  tourism: 0.02,  name: 'Ethiopia',     currency: 'ETB', symbol: 'Br'  },
  ZA: { vat: 0.15,  tourism: 0.01,  name: 'South Africa', currency: 'ZAR', symbol: 'R'   },
  ZW: { vat: 0.15,  tourism: 0.02,  name: 'Zimbabwe',     currency: 'ZWL', symbol: 'Z$'  },
  ZM: { vat: 0.16,  tourism: 0.015, name: 'Zambia',       currency: 'ZMW', symbol: 'ZK'  },
  MZ: { vat: 0.17,  tourism: 0.015, name: 'Mozambique',   currency: 'MZN', symbol: 'MT'  },
  BW: { vat: 0.14,  tourism: 0.01,  name: 'Botswana',     currency: 'BWP', symbol: 'P'   },
  NA: { vat: 0.15,  tourism: 0.01,  name: 'Namibia',      currency: 'NAD', symbol: 'N$'  },
  AO: { vat: 0.14,  tourism: 0.02,  name: 'Angola',       currency: 'AOA', symbol: 'Kz'  },
  MG: { vat: 0.20,  tourism: 0.02,  name: 'Madagascar',   currency: 'MGA', symbol: 'Ar'  },
  MU: { vat: 0.15,  tourism: 0.02,  name: 'Mauritius',    currency: 'MUR', symbol: 'Rs'  },
  NG: { vat: 0.075, tourism: 0.01,  name: 'Nigeria',      currency: 'NGN', symbol: '₦'   },
  GH: { vat: 0.15,  tourism: 0.01,  name: 'Ghana',        currency: 'GHS', symbol: 'GH₵' },
};

export interface PricingInput {
  baseRate: number;
  nights: number;
  cleaningFee?: number;
  serviceFee?: number;
  country?: string;
}

export interface PricingResult {
  baseRate: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  discountPct: number;
  discountAmount: number;
  vatRate: number;
  vatAmount: number;
  tourismRate: number;
  tourismAmount: number;
  total: number;
  perNight: number;
  breakdown: string[];
  countryName: string;
  currency: string;
}

export function calculateBookingPrice(input: PricingInput): PricingResult {
  const { baseRate, nights, cleaningFee = 0, serviceFee = 0, country = 'KE' } = input;
  const tax = COUNTRY_TAX_CONFIG[country] || COUNTRY_TAX_CONFIG.KE;

  // Weekly / Monthly discounts (Airbnb-style)
  let discountPct = 0;
  if (nights >= 28) discountPct = 0.20;       // 20% monthly discount
  else if (nights >= 7) discountPct = 0.10;   // 10% weekly discount

  const subtotal = baseRate * nights;
  const discountAmount = Math.floor(subtotal * discountPct);
  const discountedSubtotal = subtotal - discountAmount;

  const vatAmount = Math.floor((discountedSubtotal + cleaningFee + serviceFee) * tax.vat);
  const tourismAmount = Math.floor((discountedSubtotal) * tax.tourism);
  const total = discountedSubtotal + cleaningFee + serviceFee + vatAmount + tourismAmount;

  const breakdown: string[] = [
    `${tax.symbol} ${baseRate.toLocaleString()} × ${nights} nights = ${tax.symbol} ${subtotal.toLocaleString()}`,
    ...(discountPct > 0 ? [`${discountPct * 100}% ${nights >= 28 ? 'Monthly' : 'Weekly'} Discount: -${tax.symbol} ${discountAmount.toLocaleString()}`] : []),
    ...(cleaningFee > 0 ? [`Cleaning Fee: ${tax.symbol} ${cleaningFee.toLocaleString()}`] : []),
    ...(serviceFee > 0 ? [`Service Fee: ${tax.symbol} ${serviceFee.toLocaleString()}`] : []),
    `${tax.name} VAT (${(tax.vat * 100).toFixed(0)}%): ${tax.symbol} ${vatAmount.toLocaleString()}`,
    `Tourism Levy (${(tax.tourism * 100).toFixed(1)}%): ${tax.symbol} ${tourismAmount.toLocaleString()}`,
  ];

  return {
    baseRate, nights, subtotal, cleaningFee, serviceFee,
    discountPct, discountAmount,
    vatRate: tax.vat, vatAmount,
    tourismRate: tax.tourism, tourismAmount,
    total, perNight: Math.floor(total / nights),
    breakdown,
    countryName: tax.name,
    currency: tax.symbol,
  };
}
