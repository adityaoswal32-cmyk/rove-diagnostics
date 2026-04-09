import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only initialize Supabase if keys exist (prevents build errors if env is missing)
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!supabase) {
      console.warn("Supabase keys missing. Simulating success for:", email);
      return NextResponse.json({ message: 'Successfully joined the waitlist!' }, { status: 200 });
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }]);

    if (error) {
      // 23505 is the PostgreSQL code for UNIQUE constraint violation
      if (error.code === '23505') {
        return NextResponse.json({ error: 'You are already on the waitlist!' }, { status: 400 });
      }
      throw error;
    }

    console.log(`✅ [Waitlist] Successfully registered: ${email}`);

    return NextResponse.json(
      { message: 'Successfully joined the waitlist!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Waitlist API Error]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
