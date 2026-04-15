import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'default';
    const transaction = searchParams.get('transaction');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 100;
    const offset = (page - 1) * limit;

    let query = supabase.from('properties').select('*').range(offset, offset + limit - 1);

    if (category && category !== 'All') query = query.eq('category', category);
    if (sort === 'low') query = query.order('price', { ascending: true });
    else if (sort === 'high') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    // Filter by transaction type in memory (array column)
    let filtered = data || [];
    if (transaction && transaction !== 'all') {
      filtered = filtered.filter((p: any) => p.transactions?.includes(transaction));
    }

    return NextResponse.json({ properties: filtered });
  } catch (error) {
    console.error('Properties GET error:', error);
    return NextResponse.json({ properties: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { data, error } = await supabase.from('properties').insert([body]).select().single();
    if (error) throw error;
    return NextResponse.json({ property: data });
  } catch (error) {
    console.error('Properties POST error:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { id, ...updates } = await req.json();
    const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ property: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
