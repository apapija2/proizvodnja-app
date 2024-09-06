const express = require('express');
const router = express.Router();
const Narudzba = require('../models/Narudzba');  // Koristimo model koji pristupa "products"

// Ruta za dohvaćanje svih narudžbi
router.get('/', async (req, res) => {
  try {
    const narudzbe = await Narudzba.find()
      .populate('kupac')
      .populate('mjestoKupca')
      .populate('materijalVani')
      .populate('bojaVani')
      .populate('materijalUnutra')
      .populate('bojaUnutra')
      .populate('aplikacija')
      .populate('model')
      .populate('staklo');
    
    res.json(narudzbe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
