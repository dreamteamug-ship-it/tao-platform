-- ═══════════════════════════════════════════════════════════════
-- WONDERLAND HOSPITALITY — TITANIUM ZENITH SCHEMA v2.0
-- Tri-Lock Escrow + Equity Bank Webhook + 26-Country Mandate
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── 1. UPGRADE ESCROW TRANSACTIONS TABLE ────────────────────────

-- Add Tri-Lock state machine columns
ALTER TABLE public.escrow_transactions
  ADD COLUMN IF NOT EXISTS tri_lock_state        TEXT DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS equity_bank_ref        TEXT,
  ADD COLUMN IF NOT EXISTS equity_narration       TEXT,
  ADD COLUMN IF NOT EXISTS funds_received_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_validated_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS released_at            TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS amanda_confidence      FLOAT,
  ADD COLUMN IF NOT EXISTS amanda_checks          JSONB,
  ADD COLUMN IF NOT EXISTS human_review_required  BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS human_review_reason    TEXT;

-- Add Tri-Lock state constraint
ALTER TABLE public.escrow_transactions
  DROP CONSTRAINT IF EXISTS escrow_tri_lock_state_check;

ALTER TABLE public.escrow_transactions
  ADD CONSTRAINT escrow_tri_lock_state_check
  CHECK (tri_lock_state IN ('PENDING','FUNDS_INGEST','AI_VALIDATION','SOVEREIGN_RELEASE'));

-- CRITICAL: Unique constraint on dealroom_id — blocks double-spend at DB level
-- This makes the double-spend protection ATOMIC (no race condition possible)
ALTER TABLE public.escrow_transactions
  DROP CONSTRAINT IF EXISTS escrow_transactions_dealroom_id_key;

ALTER TABLE public.escrow_transactions
  ADD CONSTRAINT escrow_transactions_dealroom_id_key UNIQUE (dealroom_id);

-- ── 2. EQUITY WEBHOOK LOG TABLE ─────────────────────────────────

CREATE TABLE IF NOT EXISTS public.equity_webhook_log (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_ref         TEXT NOT NULL,
  dealroom_id      TEXT,
  amount           NUMERIC(20, 4),
  currency         TEXT,
  event_type       TEXT,
  status           TEXT DEFAULT 'received',
  raw_payload      JSONB,
  processed_at     TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Service role only
ALTER TABLE public.equity_webhook_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.equity_webhook_log
  TO service_role USING (true) WITH CHECK (true);

-- ── 3. ADD TRI-LOCK COLUMNS TO tao_users ────────────────────────

ALTER TABLE public.tao_users
  ADD COLUMN IF NOT EXISTS equity_account   TEXT,
  ADD COLUMN IF NOT EXISTS kyc_status       TEXT DEFAULT 'pending'
    CHECK (kyc_status IN ('pending','verified','rejected')),
  ADD COLUMN IF NOT EXISTS trust_level      INTEGER DEFAULT 1
    CHECK (trust_level BETWEEN 1 AND 5);

-- ── 4. AMANDA SUPER MAX LOG TABLE ───────────────────────────────

CREATE TABLE IF NOT EXISTS public.amanda_supermax_log (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id        TEXT NOT NULL,
  report_slot       TEXT CHECK (report_slot IN ('08:00', '20:00')),
  confidence_score  FLOAT,
  checks_passed     INTEGER,
  checks_total      INTEGER,
  human_escalated   BOOLEAN DEFAULT false,
  escrow_id         UUID REFERENCES public.escrow_transactions(id) ON DELETE SET NULL,
  report_json       JSONB,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.amanda_supermax_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.amanda_supermax_log
  TO service_role USING (true) WITH CHECK (true);

-- ── 5. INVENTORY / ASSET FORGE TABLE ────────────────────────────

CREATE TABLE IF NOT EXISTS public.asset_inventory (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_code       TEXT UNIQUE NOT NULL,  -- e.g. TAO-NRB-777
  asset_type       TEXT CHECK (asset_type IN ('real_estate','vehicle','expert','service')),
  title            TEXT NOT NULL,
  description      TEXT,
  owner_id         UUID REFERENCES public.tao_users(id) ON DELETE SET NULL,
  country          TEXT,
  currency         TEXT,
  base_price       NUMERIC(20, 4),
  -- Escrow State Sync: if locked in escrow → globally unavailable
  availability     TEXT DEFAULT 'available'
    CHECK (availability IN ('available','locked','unavailable','sold')),
  locked_escrow_id TEXT,  -- dealroom_id reference
  locked_at        TIMESTAMPTZ,
  images           JSONB DEFAULT '[]',
  metadata         JSONB DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast availability checks
CREATE INDEX IF NOT EXISTS idx_asset_inventory_availability ON public.asset_inventory(availability);
CREATE INDEX IF NOT EXISTS idx_asset_inventory_type ON public.asset_inventory(asset_type);
CREATE INDEX IF NOT EXISTS idx_asset_inventory_country ON public.asset_inventory(country);

ALTER TABLE public.asset_inventory ENABLE ROW LEVEL SECURITY;

-- Public can read available assets
CREATE POLICY "Public read available assets" ON public.asset_inventory
  FOR SELECT USING (availability = 'available');

-- Service role full access
CREATE POLICY "Service role full access" ON public.asset_inventory
  TO service_role USING (true) WITH CHECK (true);

-- ── 6. FUNCTION: Auto-lock asset when escrow fires ───────────────

CREATE OR REPLACE FUNCTION public.sync_asset_escrow_lock()
RETURNS TRIGGER AS $$
BEGIN
  -- When escrow is locked, mark linked asset as unavailable
  IF NEW.status = 'locked' AND NEW.asset_id IS NOT NULL THEN
    UPDATE public.asset_inventory
    SET availability = 'locked',
        locked_escrow_id = NEW.dealroom_id,
        locked_at = NOW()
    WHERE asset_code = NEW.asset_id;
  END IF;

  -- When escrow is released/refunded, restore asset availability
  IF NEW.status IN ('released','refunded') AND NEW.asset_id IS NOT NULL THEN
    UPDATE public.asset_inventory
    SET availability = CASE WHEN NEW.status = 'released' THEN 'sold' ELSE 'available' END,
        locked_escrow_id = NULL,
        locked_at = NULL
    WHERE asset_code = NEW.asset_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to escrow_transactions
DROP TRIGGER IF EXISTS trg_sync_asset_escrow ON public.escrow_transactions;
CREATE TRIGGER trg_sync_asset_escrow
  AFTER INSERT OR UPDATE OF status ON public.escrow_transactions
  FOR EACH ROW EXECUTE FUNCTION public.sync_asset_escrow_lock();

-- ── 7. RLS AUDIT — Tighten sovereign data access ─────────────────

-- Escrow: Only parties or service role can read
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parties read own escrow" ON public.escrow_transactions;
CREATE POLICY "Parties read own escrow" ON public.escrow_transactions
  FOR SELECT USING (
    auth.uid()::text = buyer_id::text OR
    auth.uid()::text = seller_id::text OR
    auth.uid()::text = agent_id::text
  );

CREATE POLICY "Service role full access" ON public.escrow_transactions
  TO service_role USING (true) WITH CHECK (true);

-- SaaS revenue: CTO only (service role)
ALTER TABLE public.saas_revenue_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.saas_revenue_log
  TO service_role USING (true) WITH CHECK (true);

-- ── 8. VERIFY SCHEMA ─────────────────────────────────────────────

SELECT
  table_name,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'escrow_transactions',
    'equity_webhook_log',
    'amanda_supermax_log',
    'asset_inventory',
    'tao_users',
    'saas_revenue_log'
  )
GROUP BY table_name
ORDER BY table_name;
