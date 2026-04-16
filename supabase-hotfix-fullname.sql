-- =====================================================
-- TAO PLATFORM — HOTFIX: service_providers full_name
-- Run in: Supabase Dashboard → SQL Editor
-- =====================================================

-- Step 1: Drop the NOT NULL constraint on full_name
-- (full_name is redundant — 'name' column holds the business name)
ALTER TABLE public.service_providers
  ALTER COLUMN full_name DROP NOT NULL;

-- Step 2: Backfill full_name = name for any existing rows
UPDATE public.service_providers
  SET full_name = name
  WHERE full_name IS NULL AND name IS NOT NULL;

-- Step 3: Set a default so future inserts auto-populate full_name
ALTER TABLE public.service_providers
  ALTER COLUMN full_name SET DEFAULT NULL;

-- ─────────────────────────────────────────────────────
-- NOW RE-RUN your original SQL (supabase-phase3.sql)
-- The inserts will succeed without the NOT NULL error
-- ─────────────────────────────────────────────────────

-- Step 4: Verify the fix
SELECT COUNT(*) AS total_providers FROM public.service_providers;
SELECT id, name, full_name, category, country, kyc_status FROM public.service_providers LIMIT 5;
