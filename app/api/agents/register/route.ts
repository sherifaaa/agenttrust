import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const { name, owner_email, public_key } = await request.json();

    if (!name || !owner_email || !public_key) {
      return NextResponse.json(
        { error: 'Missing required fields: name, owner_email, public_key' },
        { status: 400 }
      );
    }

    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        name,
        owner_email,
        public_key,
        verification_level: 'unverified'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const apiKey = `ak_${randomBytes(32).toString('base64url')}`;
    const keyHash = randomBytes(32).toString('hex');

    await supabase.from('api_keys').insert({
      agent_id: agent.id,
      key_hash: keyHash,
      key_prefix: apiKey.slice(0, 8)
    });

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        verification_level: agent.verification_level
      },
      api_key: apiKey,
      message: 'Agent registered successfully. Save your API key!'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
