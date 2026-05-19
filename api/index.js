// ----- REGISTRATION (REAL Supabase insert) -----
if (url === '/api/agents/register' && method === 'POST') {
  const { name, owner_email, public_key } = req.body;
  if (!name || !owner_email || !public_key)
    return res.status(400).json({ error: 'Missing fields' });

  try {
    // 1. Insert the new agent
    const { data: agent, error: insertError } = await supabase
      .from('agents')
      .insert([{
        name,
        owner_email,
        public_key,
        verification_level: 'unverified'
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Generate a real API key (random string)
    const apiKey = 'ak_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

    // 3. Store the API key hash (using a simple hash for now)
    const simpleHash = require('crypto').createHash('sha256').update(apiKey).digest('hex');

    const { error: keyError } = await supabase
      .from('api_keys')
      .insert([{
        agent_id: agent.id,
        key_hash: simpleHash,
        key_prefix: apiKey.substring(0, 8)
      }]);

    if (keyError) throw keyError;

    // 4. Return success with real agent and API key
    return res.status(200).json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        owner_email: agent.owner_email,
        verification_level: agent.verification_level
      },
      api_key: apiKey,
      message: 'Agent registered successfully. Save your API key!'
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message });
  }
}
