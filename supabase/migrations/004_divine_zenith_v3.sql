// ═══════════════════════════════════════════════════
// WONDERLAND HOSPITALITY — SQL MIGRATION v3.0
// Divine Zenith Finality Schema
// ═══════════════════════════════════════════════════

-- Patient Recovery Score Table
CREATE TABLE IF NOT EXISTS public.patient_recovery (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id          TEXT NOT NULL,
  dealroom_id       TEXT REFERENCES public.escrow_transactions(dealroom_id) ON DELETE SET NULL,
  country           TEXT NOT NULL,
  currency          TEXT NOT NULL,
  payment_history   NUMERIC(5,2) DEFAULT 0,
  iot_telemetry     NUMERIC(5,2) DEFAULT 0,
  market_value      NUMERIC(5,2) DEFAULT 0,
  risk_index        NUMERIC(4,2) DEFAULT 1.0,
  raw_score         NUMERIC(5,2),
  adjusted_score    NUMERIC(5,2),
  status            TEXT CHECK (status IN ('GREEN','BLUE','RED')) DEFAULT 'BLUE',
  sop_path          JSONB DEFAULT '[]',
  moratorium_days   INTEGER DEFAULT 90,
  trade_in_eligible BOOLEAN DEFAULT false,
  buy_off_eligible  BOOLEAN DEFAULT false,
  human_escalated   BOOLEAN DEFAULT false,
  narrative         TEXT,
  scored_at         TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recovery_asset ON public.patient_recovery(asset_id);
CREATE INDEX IF NOT EXISTS idx_recovery_status ON public.patient_recovery(status);
CREATE INDEX IF NOT EXISTS idx_recovery_country ON public.patient_recovery(country);

ALTER TABLE public.patient_recovery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.patient_recovery TO service_role USING (true) WITH CHECK (true);

-- Sovereign IoT Telemetry Table
CREATE TABLE IF NOT EXISTS public.iot_telemetry (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id     TEXT NOT NULL,
  country      TEXT NOT NULL,
  lat          NUMERIC(10,7),
  lng          NUMERIC(10,7),
  asset_type   TEXT,
  status       TEXT CHECK (status IN ('GREEN','BLUE','RED')) DEFAULT 'BLUE',
  score        NUMERIC(5,2),
  last_ping    TIMESTAMPTZ DEFAULT NOW(),
  metadata     JSONB DEFAULT '{}'
);

ALTER TABLE public.iot_telemetry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read IoT" ON public.iot_telemetry FOR SELECT USING (true);
CREATE POLICY "Service role full access" ON public.iot_telemetry TO service_role USING (true) WITH CHECK (true);

-- Amanda Swarm Log
CREATE TABLE IF NOT EXISTS public.amanda_swarm_log (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id     TEXT NOT NULL,
  agent_id       TEXT,
  domain         TEXT,
  route          TEXT,
  model          TEXT,
  prompt_hash    TEXT, -- SHA256 of prompt for dedup
  response_len   INTEGER,
  latency_ms     INTEGER,
  status         TEXT CHECK (status IN ('GREEN','BLUE','RED')),
  human_required BOOLEAN DEFAULT false,
  sop_slot       TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.amanda_swarm_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.amanda_swarm_log TO service_role USING (true) WITH CHECK (true);

-- Seed 15 IoT assets across 27 countries
INSERT INTO public.iot_telemetry (asset_id, country, lat, lng, asset_type, status, score)
VALUES
  ('KE-001', 'KE', -1.3194, 36.7065, 'real_estate', 'GREEN', 88),
  ('KE-002', 'KE', -1.2921, 36.8219, 'vehicle',      'GREEN', 91),
  ('UG-001', 'UG',  0.3163, 32.5822, 'real_estate', 'BLUE',  62),
  ('TZ-001', 'TZ', -6.7924, 39.2083, 'real_estate', 'GREEN', 79),
  ('ZA-001', 'ZA',-26.2041, 28.0473, 'real_estate', 'GREEN', 85),
  ('RW-001', 'RW', -1.9441, 30.0619, 'real_estate', 'GREEN', 93),
  ('ET-001', 'ET',  9.0280, 38.7469, 'commercial',  'BLUE',  58),
  ('ZM-001', 'ZM',-15.4167, 28.2833, 'real_estate', 'BLUE',  67),
  ('GH-001', 'GH',  5.5502, -0.2174, 'real_estate', 'GREEN', 80),
  ('NG-001', 'NG',  6.4698,  3.5852, 'real_estate', 'BLUE',  55),
  ('MZ-001', 'MZ',-25.9692, 32.5732, 'real_estate', 'RED',   38),
  ('BW-001', 'BW',-24.6282, 25.9231, 'commercial',  'GREEN', 82),
  ('DJ-001', 'DJ', 11.5892, 43.1456, 'commercial',  'BLUE',  61),
  ('MU-001', 'MU',-20.2883, 57.5504, 'real_estate', 'GREEN', 95),
  ('NA-001', 'NA',-22.5597, 17.0832, 'real_estate', 'GREEN', 77)
ON CONFLICT DO NOTHING;

-- Verify
SELECT table_name, COUNT(*) as cols
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('patient_recovery','iot_telemetry','amanda_swarm_log')
GROUP BY table_name ORDER BY table_name;

SELECT COUNT(*) AS iot_seeds FROM public.iot_telemetry;
