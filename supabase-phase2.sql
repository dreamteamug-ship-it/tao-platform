-- =====================================================
-- TAO PLATFORM — PHASE 2 DATABASE EXPANSION
-- Run in Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. BOOKINGS TABLE (Airbnb-style)
CREATE TABLE IF NOT EXISTS public.bookings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id   TEXT REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_name    TEXT NOT NULL,
  guest_email   TEXT,
  guest_phone   TEXT,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  nights        INT GENERATED ALWAYS AS (end_date - start_date) STORED,
  base_rate     BIGINT NOT NULL,
  cleaning_fee  BIGINT DEFAULT 0,
  service_fee   BIGINT DEFAULT 0,
  vat_amount    BIGINT DEFAULT 0,
  discount_pct  DECIMAL DEFAULT 0,
  total_price   BIGINT NOT NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  country       TEXT DEFAULT 'KE',
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 2. SERVICE PROVIDERS TABLE
CREATE TABLE IF NOT EXISTS public.service_providers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  business_name   TEXT,
  email           TEXT,
  phone           TEXT,
  service_type    TEXT CHECK (service_type IN (
    'Agent','Broker','Lawyer','Valuer','Contractor','Architect',
    'Interior Designer','Property Manager','Mortgage Advisor','Insurance'
  )),
  country         TEXT DEFAULT 'KE',
  bio             TEXT,
  kyc_status      TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending','verified','rejected')),
  kyc_score       INT DEFAULT 0,
  kyc_doc_url     TEXT,
  avatar_url      TEXT,
  verified        BOOLEAN DEFAULT false,
  plan            TEXT DEFAULT 'free' CHECK (plan IN ('free','provider','premium')),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 3. PROPERTY FINANCE APPLICATIONS (Enhanced)
CREATE TABLE IF NOT EXISTS public.property_finance (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id     TEXT REFERENCES public.properties(id) ON DELETE SET NULL,
  applicant_name  TEXT NOT NULL,
  national_id     TEXT,
  phone           TEXT,
  email           TEXT,
  monthly_income  BIGINT DEFAULT 0,
  finance_type    TEXT NOT NULL,
  amount_needed   BIGINT,
  duration_months INT DEFAULT 60,
  doc_url         TEXT,
  ai_score        INT DEFAULT 0,
  ai_verdict      TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','flagged','rejected')),
  needs_human     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 4. MPESA TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.mpesa_transactions (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  checkout_request_id TEXT UNIQUE,
  merchant_request_id TEXT,
  phone             TEXT NOT NULL,
  amount            BIGINT NOT NULL,
  reference         TEXT,
  description       TEXT,
  result_code       INT,
  result_desc       TEXT,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- 5. RLS POLICIES
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_finance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mpesa_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Service role manages bookings" ON public.bookings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public can view providers" ON public.service_providers FOR SELECT USING (verified = true);
CREATE POLICY "Service role manages providers" ON public.service_providers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role manages finance" ON public.property_finance FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role manages mpesa" ON public.mpesa_transactions FOR ALL USING (auth.role() = 'service_role');

-- 6. SEED SAMPLE SERVICE PROVIDERS
INSERT INTO public.service_providers (full_name, business_name, email, phone, service_type, country, bio, kyc_status, kyc_score, verified, plan)
VALUES
  ('James Mwangi', 'Mwangi & Associates', 'james@mwangi.co.ke', '+254722000001', 'Agent', 'KE', 'Top-rated real estate agent with 12 years in Nairobi prime properties.', 'verified', 94, true, 'premium'),
  ('Sarah Odhiambo', 'Odhiambo Legal', 'sarah@odhiambolegal.com', '+254733000002', 'Lawyer', 'KE', 'Conveyancing specialist. 300+ title deeds processed with zero disputes.', 'verified', 91, true, 'provider'),
  ('Mike Njoroge', 'Njoroge Valuers', 'mike@njorogevaluers.co.ke', '+254711000003', 'Valuer', 'KE', 'Certified property valuer for banks and financial institutions.', 'verified', 88, true, 'provider'),
  ('Grace Akinyi', 'Grace Designs', 'grace@gracedesigns.co.ke', '+254700000004', 'Interior Designer', 'KE', 'Award-winning interior design for residential and commercial spaces.', 'verified', 95, true, 'premium'),
  ('David Otieno', 'Otieno Mortgage Advisory', 'david@otieno.co.ke', '+254722000005', 'Mortgage Advisor', 'KE', 'Connect you to the best mortgage rates from 15+ Kenyan banks.', 'verified', 90, true, 'provider')
ON CONFLICT DO NOTHING;
