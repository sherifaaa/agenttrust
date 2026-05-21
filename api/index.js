export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = req.url;
  const method = req.method;

  // Health check
  if (url === '/api/hello' && method === 'GET') {
    return res.status(200).json({ message: 'AgentTrust API ready' });
  }

  // Registration (test version, no database)
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

  // Ping
  if (url === '/api/ping' && method === 'GET') {
    return res.status(200).send('pong');
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
