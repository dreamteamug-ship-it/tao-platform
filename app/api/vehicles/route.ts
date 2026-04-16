import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;
    return NextResponse.json({ vehicles: data || [] });
  } catch {
    return NextResponse.json({ vehicles: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('vehicles')
      .insert([{
        make: body.make,
        model: body.model,
        year: body.year,
        category: body.category,
        price: body.price,
        condition: body.condition || 'Used',
        mileage: body.mileage,
        color: body.color,
        engine_cc: body.engine_cc,
        fuel_type: body.fuel_type,
        transmission: body.transmission,
        drive_type: body.drive_type,
        image_url: body.image_url,
        agent: body.agent,
        country: body.country || 'KE',
        verified: body.verified || false,
        narrative_description: body.narrative_description,
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ vehicle: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
