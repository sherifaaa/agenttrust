import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  try {
    // Try to query the agents table
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .limit(1);

    if (error) {
      return res.status(500).json({ 
        error: 'Database error: ' + error.message,
        details: error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Database connected!',
      data: data
    });
  } catch (err) {
    return res.status(500).json({ 
      error: 'Connection failed: ' + err.message 
    });
  }
}
