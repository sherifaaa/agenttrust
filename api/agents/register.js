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

    // Test the database connection first
    const { data: testData, error: testError } = await supabase
      .from('agents')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('Database connection error:', testError);
      return res.status(500).json({ 
        error: 'Database connection failed: ' + testError.message
      });
    }

    // Try a simple insert without API key generation
    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        name: name,
        owner_email: owner_email,
        public_key: public_key,
        verification_level: 'unverified'
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ 
        error: 'Insert failed: ' + error.message
      });
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Agent registered successfully!',
      agent: agent
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: 'Server error: ' + error.message
    });
  }
}
