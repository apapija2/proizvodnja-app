const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Request body:', req.body);  // Provjera podataka iz forme

  const user = await User.findOne({ username });
  if (!user) {
    console.log('Korisnik nije pronađen');
    return res.status(400).send('Invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    console.log('Neispravna lozinka');
    return res.status(400).send('Invalid credentials');
  }

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
  console.log('Token generated:', token);  // Prikaz generiranog tokena
  res.header('auth-token', token).send(token);
});

module.exports = router;

