import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data: reputation, error } = await supabase
      .from('reputation_scores')
      .select('*')
      .eq('agent_id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      agent_id: id,
      overall_score: reputation.overall_score,
      trust_score: reputation.trust_score,
      total_interactions: reputation.total_interactions,
      success_rate: reputation.success_rate
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
