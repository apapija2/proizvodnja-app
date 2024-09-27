const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided' });

  const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer'
  if (!token) return res.status(401).json({ error: 'Access denied. Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = verifyToken;

