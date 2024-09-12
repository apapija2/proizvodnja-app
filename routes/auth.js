const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Provjeri da ovaj put pokazuje na tvoj model korisnika

// Ruta za prijavu korisnika
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Request body:', req.body);  // Prikaz podataka iz forme

  try {
    // Provjeri postoji li korisnik
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Korisnik nije pronađen');
      return res.status(400).send('Neispravni podaci. Pokušajte ponovo.');
    }

    // Provjeri lozinku
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Neispravna lozinka');
      return res.status(400).send('Neispravni podaci. Pokušajte ponovo.');
    }

    // Generiraj JWT token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    res.header('auth-token', token).send({ token });
  } catch (error) {
    console.error('Greška prilikom prijave:', error);
    res.status(500).send('Došlo je do greške. Pokušajte ponovo.');
  }
});

module.exports = router;
