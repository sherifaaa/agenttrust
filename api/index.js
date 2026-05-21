// ----- REGISTRATION (REAL Supabase insert) -----
if (url === '/api/agents/register' && method === 'POST') {
  const { name, owner_email, public_key } = req.body;
  if (!name || !owner_email || !public_key)
    return res.status(400).json({ error: 'Missing fields' });

  try {
    // Insert into Supabase
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

    // Generate a real API key
    const apiKey = 'ak_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    
    // Store API key (plain for now – you can hash later)
    await supabase.from('api_keys').insert([{
      agent_id: agent.id,
      key_hash: apiKey,
      key_prefix: apiKey.substring(0, 8)
    }]);

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
