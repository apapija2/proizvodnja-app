const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader);  // Provjera Authorization zaglavlja

  const token = authHeader?.split(' ')[1];  // Uzimanje tokena iz Authorization zaglavlja
  console.log('Token:', token);  // Provjera vrijednosti tokena

  if (!token) {
    console.log('Token missing');
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);  // Provjera JWT tokena
    console.log('Verified token:', verified);  // Ispis verificiranog tokena
    req.user = verified;  // Spremanje korisničkih podataka iz tokena u req.user
    next();
  } catch (err) {
    console.log('Invalid token:', err.message);  // Ispis greške prilikom verifikacije tokena
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;

