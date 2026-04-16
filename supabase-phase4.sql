-- =====================================================
-- TAO PLATFORM — PHASE 4 SCHEMA
-- Fission Profiles, Dealroom, Escrow, SaaS Revenue
-- Run in: Supabase Dashboard → SQL Editor
-- =====================================================

-- ─────────────────────────────────────────────────────
-- 1. PROFILES TABLE (Fission Registration)
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone                 TEXT UNIQUE,
  email                 TEXT,
  full_name             TEXT,
  country               TEXT DEFAULT 'KE',
  preferred_language    TEXT DEFAULT 'en',
  secondary_language    TEXT,              -- max 1 secondary per country
  role                  TEXT CHECK (role IN ('buyer','seller','agent','legal','admin','cto')) DEFAULT 'buyer',
  referred_by           TEXT,
  home_lat              DECIMAL(10,7) DEFAULT -1.2864, -- Nairobi default
  home_lng              DECIMAL(10,7) DEFAULT 36.8172,
  home_currency         TEXT DEFAULT 'KES',
  titanium_qr           TEXT UNIQUE,
  dealroom_id           TEXT UNIQUE,
  fission_registered    BOOLEAN DEFAULT false,
  fission_registered_at TIMESTAMPTZ,
  kyc_verified          BOOLEAN DEFAULT false,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "profiles_own_read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "profiles_admin_all"  ON public.profiles FOR ALL USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────
-- 2. FISSION EVENTS LOG
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fission_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    UUID REFERENCES public.profiles(id),
  token_payload JSONB,
  asset_id      TEXT,
  referred_by   TEXT,
  dealroom_id   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fission_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "fission_admin_all" ON public.fission_events FOR ALL USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────
-- 3. ESCROW TRANSACTIONS
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealroom_id         TEXT NOT NULL,
  asset_id            TEXT,
  deal_price          DECIMAL(20,4) NOT NULL,
  currency            TEXT DEFAULT 'KES',
  escrow_amount       DECIMAL(20,4) NOT NULL,
  escrow_rate         DECIMAL(6,4) DEFAULT 0.10,
  saas_fee            DECIMAL(20,4) NOT NULL,
  saas_fee_kes        DECIMAL(20,4),
  saas_rate           DECIMAL(6,4) DEFAULT 0.005,
  agent_commission    DECIMAL(20,4),
  escrow_amount_kes   DECIMAL(20,4),
  buyer_id            UUID REFERENCES public.profiles(id),
  seller_id           UUID REFERENCES public.profiles(id),
  agent_id            UUID REFERENCES public.profiles(id),
  status              TEXT CHECK (status IN ('locked','released','disputed','refunded')) DEFAULT 'locked',
  locked_at           TIMESTAMPTZ DEFAULT NOW(),
  released_at         TIMESTAMPTZ,
  sop_report_slot     TEXT CHECK (sop_report_slot IN ('08:00','20:00')),
  amanda_minutes      JSONB,
  minor_unit_escrow   BIGINT,
  minor_unit_saas     BIGINT,
  notes               TEXT
);

ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "escrow_admin_all" ON public.escrow_transactions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "escrow_parties_read" ON public.escrow_transactions FOR SELECT
  USING (auth.uid()::text IN (buyer_id::text, seller_id::text, agent_id::text));

-- ─────────────────────────────────────────────────────
-- 4. SAAS REVENUE LOG (CTO Monetization Tracker)
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saas_revenue_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_id           UUID REFERENCES public.escrow_transactions(id),
  dealroom_id         TEXT,
  fee_amount          DECIMAL(20,4) NOT NULL,
  fee_currency        TEXT DEFAULT 'KES',
  fee_kes_equivalent  DECIMAL(20,4),
  deal_price          DECIMAL(20,4),
  rate_applied        DECIMAL(6,4) DEFAULT 0.005,
  log_time            TIMESTAMPTZ DEFAULT NOW(),
  sop_slot            TEXT,
  collection_account  TEXT DEFAULT 'TAO_MAIN_REVENUE_ACC',
  status              TEXT CHECK (status IN ('pending_settlement','settled','failed')) DEFAULT 'pending_settlement',
  settled_at          TIMESTAMPTZ
);

ALTER TABLE public.saas_revenue_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "saas_cto_only" ON public.saas_revenue_log FOR ALL USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────
-- 5. DEALROOM SESSIONS
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.dealroom_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealroom_id   TEXT UNIQUE NOT NULL,
  asset_id      TEXT,
  host_id       UUID REFERENCES public.profiles(id),
  status        TEXT CHECK (status IN ('open','locked','closed')) DEFAULT 'open',
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  ended_at      TIMESTAMPTZ,
  participant_count INTEGER DEFAULT 1,
  transcript    JSONB,
  escrow_id     UUID REFERENCES public.escrow_transactions(id)
);

ALTER TABLE public.dealroom_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "dealroom_admin_all" ON public.dealroom_sessions FOR ALL USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────
-- 6. ADD ai_generated TO service_providers (if missing)
-- ─────────────────────────────────────────────────────
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;

-- ─────────────────────────────────────────────────────
-- 7. INDEXES FOR PERFORMANCE
-- ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_phone  ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_qr     ON public.profiles(titanium_qr);
CREATE INDEX IF NOT EXISTS idx_profiles_dr     ON public.profiles(dealroom_id);
CREATE INDEX IF NOT EXISTS idx_escrow_dr       ON public.escrow_transactions(dealroom_id);
CREATE INDEX IF NOT EXISTS idx_saas_slot       ON public.saas_revenue_log(sop_slot);
CREATE INDEX IF NOT EXISTS idx_saas_status     ON public.saas_revenue_log(status);
CREATE INDEX IF NOT EXISTS idx_fission_profile ON public.fission_events(profile_id);
