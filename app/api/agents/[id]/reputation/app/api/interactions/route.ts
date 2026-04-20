import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { from_agent_id, to_agent_id, outcome, type, rating } = await request.json();

    if (!from_agent_id || !to_agent_id || !outcome) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: interaction, error } = await supabase
      .from('interactions')
      .insert({
        from_agent_id,
        to_agent_id,
        outcome,
        type: type || 'api_call',
        rating
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update reputation scores
    if (outcome === 'success') {
      await supabase.rpc('update_reputation', { agent_id: to_agent_id, success: true });
    } else if (outcome === 'failure') {
      await supabase.rpc('update_reputation', { agent_id: to_agent_id, success: false });
    }

    return NextResponse.json(interaction);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id');

    if (!agentId) {
      return NextResponse.json({ error: 'agent_id required' }, { status: 400 });
    }

    const { data: interactions, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('to_agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(interactions);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
