-- =====================================================
-- TOGETHER AS ONE — SUPABASE DATABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor
-- Project: rwcbioegrnmhhbmfiutx.supabase.co
-- =====================================================

-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id          TEXT PRIMARY KEY DEFAULT 'TAO-' || floor(random() * 900000 + 100000)::text,
  title       TEXT NOT NULL,
  category    TEXT CHECK (category IN ('Residential', 'Commercial', 'Land', 'Airbnb')) NOT NULL,
  price       BIGINT NOT NULL,
  image_url   TEXT,
  gps_active  BOOLEAN DEFAULT true,
  lat         DECIMAL(10, 6),
  lng         DECIMAL(10, 6),
  agent       TEXT,
  verified    BOOLEAN DEFAULT false,
  share_unlock BOOLEAN DEFAULT false,
  bedrooms    INT DEFAULT 1,
  bathrooms   INT DEFAULT 1,
  land_size   INT DEFAULT 100,
  year_built  INT DEFAULT 2020,
  transactions TEXT[] DEFAULT ARRAY['buy'],
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. KYC APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.kyc_applications (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name       TEXT NOT NULL,
  national_id     TEXT,
  monthly_income  BIGINT DEFAULT 0,
  role            TEXT DEFAULT 'Standard',
  ai_score        INT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 3. FINANCE APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.finance_applications (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id     TEXT REFERENCES public.properties(id) ON DELETE SET NULL,
  finance_type    TEXT NOT NULL,
  full_name       TEXT NOT NULL,
  national_id     TEXT,
  monthly_income  BIGINT DEFAULT 0,
  ai_score        INT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_applications ENABLE ROW LEVEL SECURITY;

-- Allow public read on properties
CREATE POLICY "Anyone can view properties"
  ON public.properties FOR SELECT USING (true);

-- Only service role can insert/update
CREATE POLICY "Service role can manage properties"
  ON public.properties FOR ALL USING (auth.role() = 'service_role');

-- KYC: service role only 
CREATE POLICY "Service role manages KYC"
  ON public.kyc_applications FOR ALL USING (auth.role() = 'service_role');

-- Finance: service role only
CREATE POLICY "Service role manages finance"
  ON public.finance_applications FOR ALL USING (auth.role() = 'service_role');

-- 5. SEED 10 SAMPLE PROPERTIES
INSERT INTO public.properties (id, title, category, price, image_url, gps_active, lat, lng, agent, verified, bedrooms, bathrooms, land_size, year_built, transactions)
VALUES
  ('TAO-1001', 'Luxury Residential Villa, Runda', 'Residential', 85000000, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=75', true, -1.2191, 36.7998, 'Agent James', true, 5, 4, 450, 2022, ARRAY['buy']),
  ('TAO-1002', 'Prime Commercial Plaza, Westlands', 'Commercial', 120000000, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=75', true, -1.2637, 36.8044, 'Agent Sarah', true, 0, 4, 800, 2019, ARRAY['buy', 'lease']),
  ('TAO-1003', 'Agricultural Land, Thika Road', 'Land', 8500000, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=75', true, -1.0332, 37.0690, 'Agent Mike', false, 0, 0, 2000, 2000, ARRAY['buy', 'tradein']),
  ('TAO-1004', 'Premium Airbnb, Kilimani', 'Airbnb', 15000000, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=75', true, -1.2921, 36.7819, 'Agent Grace', true, 3, 2, 180, 2021, ARRAY['rent']),
  ('TAO-1005', '3BR Apartment, Parklands', 'Residential', 22000000, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=75', true, -1.2676, 36.8119, 'Agent David', true, 3, 2, 150, 2020, ARRAY['buy', 'rent']),
  ('TAO-1006', 'Office Complex, Upper Hill', 'Commercial', 200000000, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=75', true, -1.2985, 36.8173, 'Agent James', true, 0, 8, 1200, 2018, ARRAY['buy', 'lease']),
  ('TAO-1007', 'Quarter Acre Plot, Karen', 'Land', 18000000, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=75', false, -1.3397, 36.7126, 'Agent Sarah', true, 0, 0, 1000, 2000, ARRAY['buy']),
  ('TAO-1008', 'Beach Airbnb, Diani', 'Airbnb', 9500000, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=75', true, -4.2764, 39.5985, 'Agent Grace', true, 2, 2, 200, 2023, ARRAY['rent', 'tradein']),
  ('TAO-1009', 'Penthouse, Riverside Drive', 'Residential', 65000000, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=75', true, -1.2833, 36.8183, 'Agent Mike', true, 4, 3, 280, 2021, ARRAY['buy']),
  ('TAO-1010', 'Retail Strip Mall, Mombasa Rd', 'Commercial', 45000000, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=75', true, -1.3192, 36.8540, 'Agent David', false, 0, 2, 500, 2017, ARRAY['buy', 'lease', 'rent'])
ON CONFLICT (id) DO NOTHING;

-- Done! Your Together As One database is ready.
