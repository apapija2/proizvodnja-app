const express = require('express');
const router = express.Router();
const Narudzba = require('../models/Narudzba');

// Ruta za dodavanje nove narudžbe
router.post('/', async (req, res) => {
  const {
    sifraProizvoda,
    datumNarudzbe,
    kupac,
    mjestoKupca,
    materijalVani,
    bojaVani,
    materijalUnutra,
    bojaUnutra,
    aplikacija,
    model,
    staklo,
    dimenzije,
    kolicina,
    napomena,
  } = req.body;

  try {
    const novaNarudzba = new Narudzba({
      sifraProizvoda,
      datumNarudzbe,
      kupac,
      mjestoKupca,
      materijalVani,
      bojaVani,
      materijalUnutra,
      bojaUnutra,
      aplikacija,
      model,
      staklo,
      dimenzije,
      kolicina,
      napomena,
    });
    await novaNarudzba.save();
    res.status(201).json(novaNarudzba);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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
