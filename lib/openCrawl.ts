export const getMarketIntel = async (region: string) => {
  const data = {
    region,
    sentiment: 'Bullish',
    competitor_avg: 'KES 14,500',
    wonderland_optimum: 'KES 13,800',
    llm_confidence: 0.94
  };
  return data;
};