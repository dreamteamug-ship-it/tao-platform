import { createClient } from '@supabase/supabase-js';

export async function triggerFiscalReceipt(escrowId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Fetch transaction details
  const { data: tx, error } = await supabase
    .from('escrow_transactions')
    .select('*, profiles(full_name, phone)')
    .eq('id', escrowId)
    .single();

  if (error || !tx) throw new Error('Transaction not found');

  // 2. Calculate Fiscal Components
  const total = tx.amount;
  const saasFee = total * 0.005; // 0.5% Mandatory Sweep
  const taxableAmount = saasFee / 1.16; // Assuming 16% VAT inclusion for KE
  const vatAmount = saasFee - taxableAmount;

  // 3. Mock eTIMS Handshake (KRA API Simulation)
  const fiscalData = {
    invoice_no: 'INV-' + Math.random().toString(36).substring(7).toUpperCase(),
    customer: tx.profiles.full_name,
    amount: saasFee.toFixed(2),
    vat: vatAmount.toFixed(2),
    status: 'FISCAL_SIGNED',
    timestamp: new Date().toISOString()
  };

  // 4. Update the Ledger
  await supabase
    .from('etims_logs')
    .insert([{ 
      escrow_id: escrowId, 
      kra_ref: fiscalData.invoice_no, 
      signed_payload: JSON.stringify(fiscalData) 
    }]);

  console.log('🏛️ [FISCAL] eTIMS Receipt Generated:', fiscalData.invoice_no);
  return fiscalData;
}