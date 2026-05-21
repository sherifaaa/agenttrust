export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = req.url;
  const method = req.method;

  // Health check (test this first)
  if (url === '/api/hello' && method === 'GET') {
    return res.status(200).json({ message: 'AgentTrust API ready' });
  }

  // Minimal registration (no database – will return test_ id)
  if (url === '/api/agents/register' && method === 'POST') {
    const { name, owner_email, public_key } = req.body;
    if (!name || !owner_email || !public_key) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    return res.status(200).json({
      success: true,
      agent: {
        id: 'test_' + Date.now(),
        name,
        owner_email,
        verification_level: 'unverified'
      },
      api_key: 'test_key_' + Math.random().toString(36)
    });
  }

  // Ping endpoint (for testing)
  if (url === '/api/ping' && method === 'GET') {
    return res.status(200).send('pong');
  }

  // Catch all other requests
  return res.status(404).json({ error: 'Endpoint not found' });
}
