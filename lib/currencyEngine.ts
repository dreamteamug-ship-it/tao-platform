export const convertToLocal = (kesAmount: number, countryCode: string) => {
  const rates: Record<string, number> = {
    KE: 1,      // KES
    UG: 28.5,   // UGX
    TZ: 19.2,   // TZS
    ZA: 0.14,   // ZAR
    RW: 9.8     // RWF
  };
  const rate = rates[countryCode] || 1;
  return kesAmount * rate;
};

export const formatCurrency = (amount: number, countryCode: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: countryCode === 'KE' ? 'KES' : countryCode === 'ZA' ? 'ZAR' : 'USD',
  }).format(amount);
};
