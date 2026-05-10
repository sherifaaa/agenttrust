export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST method' });
  }

  try {
    const { name, owner_email, public_key } = req.body;

    if (!name || !owner_email || !public_key) {
      return res.status(400).json({ 
        error: 'Missing: name, owner_email, public_key' 
      });
    }

    // Return a mock success (no database for now)
    return res.status(200).json({
      success: true,
      agent: {
        id: 'mock_' + Date.now(),
        name: name,
        owner_email: owner_email,
        verification_level: 'unverified'
      },
      api_key: 'ak_mock_' + Math.random().toString(36).substring(2)
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
