export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO' | 'ELITE' | 'ULTRA' | 'SOVEREIGN';

export const SUBSCRIPTION_MODELS = {
  FREE: { price: 0, posts: 5, seo_weight: 1.0, smm: false, label: 'Starter' },
  BASIC: { price: 5, posts: 20, seo_weight: 1.5, smm: false, label: 'Growth' },
  PRO: { price: 10, posts: 50, seo_weight: 2.5, smm: true, label: 'Professional' },
  ELITE: { price: 20, posts: 100, seo_weight: 4.0, smm: true, label: 'Enterprise' },
  ULTRA: { price: 50, posts: 500, seo_weight: 10.0, smm: true, label: 'Dominance' },
  SOVEREIGN: { price: 100, posts: 9999, seo_weight: 25.0, smm: true, label: 'Overlord' }
};

export const calculateRegionalPrice = (usdPrice: number, rate: number) => {
  return usdPrice * rate; // Normalized across 26 countries
};

export const applyAIBoost = (tier: SubscriptionTier, marketSentiment: string) => {
  const baseBoost = SUBSCRIPTION_MODELS[tier].seo_weight;
  // Amanda AI adjusts boost based on market competition
  return marketSentiment === 'High Velocity' ? baseBoost * 1.2 : baseBoost;
};