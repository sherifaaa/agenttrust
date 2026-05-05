export default function handler(req, res) {
  res.status(200).json({ 
    message: "AgentTrust API is ready!",
    status: "online",
    timestamp: new Date().toISOString()
  });
}
