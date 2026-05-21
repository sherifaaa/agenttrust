export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Registration endpoint is working. Use POST.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
