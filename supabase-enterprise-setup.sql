-- TITANIUM ENTERPRISE SCHEMA
CREATE TABLE IF NOT EXISTS public.etims_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  escrow_id uuid REFERENCES public.escrow_transactions(id),
  kra_ref text UNIQUE,
  signed_payload jsonb,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.etims_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin Full Access" ON public.etims_logs FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
