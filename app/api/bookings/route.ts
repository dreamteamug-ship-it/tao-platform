import { NextRequest, NextResponse } from 'next/server';
import { calculateBookingPrice } from '@/lib/pricingCalculator';
import { createAdminClient } from '@/lib/supabase';

// GET — Fetch booked dates for a property
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('property_id');
  if (!propertyId) return NextResponse.json({ dates: [] });
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('bookings')
    .select('start_date, end_date')
    .eq('property_id', propertyId)
    .in('status', ['confirmed', 'pending']);
  return NextResponse.json({ dates: data || [] });
}

// POST — Create a booking with full price calculation
export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { property_id, guest_name, guest_email, guest_phone, start_date, end_date, base_rate, country = 'KE' } = body;

    if (!property_id || !guest_name || !start_date || !end_date || !base_rate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const startD = new Date(start_date);
    const endD = new Date(end_date);
    const nights = Math.ceil((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));

    if (nights < 1) return NextResponse.json({ error: 'Invalid dates' }, { status: 400 });

    // Check for conflicts
    const { data: conflicts } = await supabase
      .from('bookings')
      .select('id')
      .eq('property_id', property_id)
      .in('status', ['confirmed', 'pending'])
      .or(`and(start_date.lte.${end_date},end_date.gte.${start_date})`);

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'Selected dates are not available' }, { status: 409 });
    }

    const pricing = calculateBookingPrice({
      baseRate: Number(base_rate), nights,
      cleaningFee: Math.floor(Number(base_rate) * 0.1),
      serviceFee: Math.floor(Number(base_rate) * nights * 0.03),
      country,
    });

    const { data, error } = await supabase.from('bookings').insert([{
      property_id, guest_name, guest_email, guest_phone,
      start_date, end_date,
      base_rate: pricing.baseRate,
      cleaning_fee: pricing.cleaningFee,
      service_fee: pricing.serviceFee,
      vat_amount: pricing.vatAmount,
      discount_pct: pricing.discountPct,
      total_price: pricing.total,
      status: 'pending', country,
    }]).select().single();

    if (error) throw error;
    return NextResponse.json({ booking: data, pricing });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Booking failed' }, { status: 500 });
  }
}
