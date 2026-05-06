// Force redeploy - 2026-05-06

export default function handler(req, res) {
  res.status(200).json({ 
    message: "AgentTrust API is ready!",
    status: "online",
    timestamp: new Date().toISOString()
  });
}
