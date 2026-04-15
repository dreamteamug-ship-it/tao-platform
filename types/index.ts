export interface Property {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Land' | 'Airbnb';
  price: number;
  image_url: string;
  gps_active: boolean;
  lat: number;
  lng: number;
  agent: string;
  verified: boolean;
  share_unlock: boolean;
  bedrooms: number;
  bathrooms: number;
  land_size: number;
  year_built: number;
  transactions: string[];
  created_at?: string;
}

export interface KYCApplication {
  id?: string;
  full_name: string;
  national_id: string;
  monthly_income: number;
  role: string;
  ai_score?: number;
  status?: string;
  created_at?: string;
}

export interface FinanceApplication {
  id?: string;
  property_id?: string;
  finance_type: string;
  full_name: string;
  national_id: string;
  monthly_income: number;
  ai_score?: number;
  status?: string;
  created_at?: string;
}

export interface ChatMessage {
  role: 'user' | 'amanda';
  content: string;
}

export type Language = 'en' | 'sw' | 'sh';

export const TRANSLATIONS = {
  en: {
    all: 'All Properties',
    residential: 'Residential',
    commercial: 'Commercial',
    land: 'Land',
    airbnb: 'Airbnb',
    unlock: 'Share 1x to Unlock',
    locked: 'Premium Locked. Share to view.',
    sortRel: 'Sort: Relevance',
    sortLow: 'Price: Low to High',
    sortHigh: 'Price: High to Low',
    postBtn: 'Post / Subscribe',
    ctoBtn: 'CTO Login',
    onboardTitle: 'Property Owner & Landlord Portal',
    amandaHello: "Hello! I'm AI Amanda. Are you a Landlord, Agent, Broker, or Property Manager?",
    allTrans: 'All Transactions',
    forRent: 'For Rent',
    forSale: 'For Sale',
    forLease: 'For Lease',
    tradeIn: 'Trade-In',
    gpsActive: 'GPS ACTIVE',
    gpsOff: 'GPS OFF',
  },
  sw: {
    all: 'Mali Zote',
    residential: 'Makazi',
    commercial: 'Biashara',
    land: 'Ardhi',
    airbnb: 'Airbnb',
    unlock: 'Sambaza 1x Kufungua',
    locked: 'Imefungwa. Sambaza ili kuona.',
    sortRel: 'Panga: Umuhimu',
    sortLow: 'Bei: Chini - Juu',
    sortHigh: 'Bei: Juu - Chini',
    postBtn: 'Weka / Jiunge',
    ctoBtn: 'Ingia (Admin)',
    onboardTitle: 'Lango la Mmiliki wa Mali',
    amandaHello: 'Hujambo! Mimi ni AI Amanda. Je, wewe ni Mwenye Nyumba, Wakala, au Mtoa Huduma?',
    allTrans: 'Shughuli Zote',
    forRent: 'Kukodisha',
    forSale: 'Kuuzwa',
    forLease: 'Kukodi',
    tradeIn: 'Biashara',
    gpsActive: 'GPS WASHA',
    gpsOff: 'GPS ZIMA',
  },
  sh: {
    all: 'Zote',
    residential: 'Makao',
    commercial: 'Biashara',
    land: 'Shamba',
    airbnb: 'Airbnb',
    unlock: 'Share 1x Kufungua',
    locked: 'Iko Locked. Share uone.',
    sortRel: 'Panga: Relevance',
    sortLow: 'Bei: Chini - Juu',
    sortHigh: 'Bei: Juu - Chini',
    postBtn: 'Tupa / Sub',
    ctoBtn: 'Ingia (Dosi)',
    onboardTitle: 'Base ya Wamiliki',
    amandaHello: 'Mambo! Mimi ni AI Amanda. Wewe ni Landlord, Agent, ama Broker?',
    allTrans: 'Deals Zote',
    forRent: 'Kupanga',
    forSale: 'Kuuza',
    forLease: 'Lease',
    tradeIn: 'Trade-In',
    gpsActive: 'GPS ON',
    gpsOff: 'GPS OFF',
  },
};
