export default function handler(req, res) {
  res.status(200).json({ 
    message: "Test endpoint works!",
    method: req.method,
    timestamp: new Date().toISOString()
  });
}
