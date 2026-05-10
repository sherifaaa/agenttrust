import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = req.url;
  const method = req.method;

  // ----- REGISTRATION (mock for now – replace later) -----
  if (url === '/api/agents/register' && method === 'POST') {
    const { name, owner_email, public_key } = req.body;
    if (!name || !owner_email || !public_key)
      return res.status(400).json({ error: 'Missing fields' });
    return res.status(200).json({
      success: true,
      agent: { id: 'mock_' + Date.now(), name, owner_email, verification_level: 'unverified' },
      api_key: 'ak_mock_' + Math.random().toString(36).substring(2)
    });
  }

  // ----- REPUTATION (REAL Supabase query) -----
  const match = url.match(/^\/api\/agents\/([^\/]+)\/reputation$/);
  if (match && method === 'GET') {
    const agentId = match[1];
    try {
      const { data, error } = await supabase
        .from('reputation_scores')
        .select('overall_score, trust_score, total_interactions, success_rate')
        .eq('agent_id', agentId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return res.status(200).json({
        success: true,
        agent_id: agentId,
        overall_score: data?.overall_score ?? 50,
        trust_score: data?.trust_score ?? 50,
        total_interactions: data?.total_interactions ?? 0,
        success_rate: data?.success_rate ?? null
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch reputation' });
    }
  }

  // ----- INTERACTIONS (mock – add real later) -----
  if (url === '/api/interactions' && method === 'GET') {
    return res.status(200).json({ success: true, interactions: [] });
  }
  if (url === '/api/interactions' && method === 'POST') {
    const { from_agent, to_agent, outcome } = req.body;
    return res.status(200).json({ success: true, message: 'Recorded', interaction: { from_agent, to_agent, outcome } });
  }

  // ----- HEALTH -----
  if (url === '/api/hello' && method === 'GET')
    return res.status(200).json({ message: 'AgentTrust API ready', status: 'online' });
  if (url === '/api/ping' && method === 'GET')
    return res.status(200).send('pong');

  return res.status(404).json({ error: 'Endpoint not found' });
}
