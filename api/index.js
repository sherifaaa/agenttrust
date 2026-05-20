// ----- INTERACTIONS (REAL Supabase) -----
if (url === '/api/interactions' && method === 'GET') {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const agentId = searchParams.get('agent_id');
  if (!agentId) {
    return res.status(400).json({ error: 'agent_id query parameter required' });
  }
  try {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('to_agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return res.status(200).json({ success: true, interactions: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

if (url === '/api/interactions' && method === 'POST') {
  const { from_agent_id, to_agent_id, outcome, type, rating } = req.body;
  if (!from_agent_id || !to_agent_id || !outcome) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const { data, error } = await supabase
      .from('interactions')
      .insert([{
        from_agent_id,
        to_agent_id,
        outcome,
        type: type || 'api_call',
        rating: rating || null
      }])
      .select()
      .single();
    if (error) throw error;
    return res.status(200).json({ success: true, interaction: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
