// verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send('Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).send('Access denied. Token missing.');
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified; // Postavlja korisnika u req.user
    next(); // Prelazi na sljedeći middleware ili rutu
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = verifyToken;
