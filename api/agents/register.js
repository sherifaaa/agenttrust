import { supabase } from '../../lib/supabase.js';
import { randomBytes } from 'crypto';

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
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { name, owner_email, public_key } = req.body;

    // Validate required fields
    if (!name || !owner_email || !public_key) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, owner_email, public_key' 
      });
    }

    // Insert agent into database
    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        name,
        owner_email,
        public_key,
        verification_level: 'unverified'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Generate API key
    const apiKey = `ak_${randomBytes(32).toString('base64url')}`;
    const keyHash = randomBytes(32).toString('hex');

    // Store API key
    const { error: keyError } = await supabase.from('api_keys').insert({
      agent_id: agent.id,
      key_hash: keyHash,
      key_prefix: apiKey.slice(0, 8)
    });

    if (keyError) {
      console.error('API key insert error:', keyError);
      return res.status(500).json({ error: keyError.message });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        verification_level: agent.verification_level,
        created_at: agent.created_at
      },
      api_key: apiKey,
      message: 'Agent registered successfully. Save your API key!'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
