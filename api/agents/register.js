import { supabase } from '../../lib/supabase.js';

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

    // Insert into database
    const { data: agent, error } = await supabase
      .from('agents')
      .insert([
        {
          name: name,
          owner_email: owner_email,
          public_key: public_key,
          verification_level: 'unverified'
        }
      ])
      .select();

    if (error) {
      console.error('DB Error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      agent: agent[0]
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
