import { NextRequest, NextResponse } from 'next/server';

// M-Pesa STK Push API Route
// Integrates with Safaricom Daraja API
// Credentials via env: MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL

async function getMpesaToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');
  const res = await fetch(
    'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  );
  const data = await res.json();
  return data.access_token;
}

function getMpesaTimestamp(): string {
  return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
}

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, reference, description } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json({ error: 'Phone and amount are required' }, { status: 400 });
    }

    // Sanitize phone (convert 07XX → 2547XX)
    const sanitizedPhone = phone.toString().replace(/^0/, '254').replace(/^\+/, '');

    // Check if credentials are configured
    if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_SHORTCODE) {
      // Return mock response for development / missing credentials
      return NextResponse.json({
        success: true,
        mock: true,
        message: `M-Pesa STK Push initiated to ${sanitizedPhone}. Check your phone for PIN prompt.`,
        checkout_request_id: `mock-${Date.now()}`,
        merchant_request_id: `mock-merchant-${Date.now()}`,
        note: 'Add MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY to .env.local to enable live payments.',
      });
    }

    const token = await getMpesaToken();
    const timestamp = getMpesaTimestamp();
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const stkRes = await fetch(
      'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.ceil(amount),
          PartyA: sanitizedPhone,
          PartyB: shortcode,
          PhoneNumber: sanitizedPhone,
          CallBackURL: process.env.MPESA_CALLBACK_URL || `${process.env.NEXTAUTH_URL}/api/mpesa/callback`,
          AccountReference: reference || 'TAO-PLATFORM',
          TransactionDesc: description || 'Together As One Payment',
        }),
      }
    );

    const result = await stkRes.json();

    if (result.ResponseCode === '0') {
      return NextResponse.json({
        success: true,
        message: 'STK Push sent. Check your phone for the M-Pesa PIN prompt.',
        checkout_request_id: result.CheckoutRequestID,
        merchant_request_id: result.MerchantRequestID,
      });
    }

    return NextResponse.json({ error: result.errorMessage || 'STK Push failed' }, { status: 422 });
  } catch (err: any) {
    console.error('M-Pesa error:', err);
    return NextResponse.json({ error: 'M-Pesa service unavailable' }, { status: 500 });
  }
}

// Callback handler for Safaricom to POST results
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { createAdminClient } = await import('@/lib/supabase');
    const supabase = createAdminClient();

    const result = body?.Body?.stkCallback;
    if (!result) return NextResponse.json({ ResultCode: 0, ResultDesc: 'OK' });

    await supabase.from('mpesa_transactions').upsert({
      checkout_request_id: result.CheckoutRequestID,
      merchant_request_id: result.MerchantRequestID,
      result_code: result.ResultCode,
      result_desc: result.ResultDesc,
      status: result.ResultCode === 0 ? 'success' : 'failed',
    }, { onConflict: 'checkout_request_id' });

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch {
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'OK' });
  }
}
