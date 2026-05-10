export default function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id } = req.query; // agent ID from the URL

  // Mock reputation data – returns a random score between 50 and 100
  const mockScore = Math.floor(Math.random() * 50) + 50;

  res.status(200).json({
    success: true,
    agent_id: id,
    overall_score: mockScore,
    trust_score: mockScore - 5,
    total_interactions: Math.floor(Math.random() * 100)
  });
}
