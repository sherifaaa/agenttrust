import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { from_agent_id, to_agent_id, outcome, type, rating } = await request.json();

    if (!from_agent_id || !to_agent_id || !outcome) {
      return NextResponse.json(
        { error: 'Missing required fields: from_agent_id, to_agent_id, outcome' },
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
        rating: rating || null
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update reputation score based on outcome
    if (outcome === 'success') {
      // Increase reputation (simplified - you can make this more sophisticated)
      const { data: currentRep } = await supabase
        .from('reputation_scores')
        .select('overall_score')
        .eq('agent_id', to_agent_id)
        .single();

      if (currentRep) {
        const newScore = Math.min(100, currentRep.overall_score + 1);
        await supabase
          .from('reputation_scores')
          .update({ overall_score: newScore })
          .eq('agent_id', to_agent_id);
      }
    } else if (outcome === 'failure') {
      // Decrease reputation
      const { data: currentRep } = await supabase
        .from('reputation_scores')
        .select('overall_score')
        .eq('agent_id', to_agent_id)
        .single();

      if (currentRep) {
        const newScore = Math.max(0, currentRep.overall_score - 5);
        await supabase
          .from('reputation_scores')
          .update({ overall_score: newScore })
          .eq('agent_id', to_agent_id);
      }
    }

    return NextResponse.json({
      success: true,
      interaction,
      message: 'Interaction recorded successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id');

    if (!agentId) {
      return NextResponse.json(
        { error: 'agent_id query parameter is required' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      interactions
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
