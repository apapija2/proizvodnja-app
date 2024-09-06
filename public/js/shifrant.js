const express = require('express');
const router = express.Router();

const Kupac = require('../models/Kupac');
const Mjesto = require('../models/Mjesto');
const MaterijalVani = require('../models/MaterijalVani');
const BojaVani = require('../models/BojaVani');
const MaterijalUnutra = require('../models/MaterijalUnutra');
const BojaUnutra = require('../models/BojaUnutra');
const Aplikacija = require('../models/Aplikacija');
const Model = require('../models/Model');
const Staklo = require('../models/Staklo');

// Generiranje ruta za svaki šifrant
const createRoutesForModel = (model, modelName) => {
  router.post(`/sifrant-${modelName}`, async (req, res) => {
    const { naziv } = req.body;
    try {
      const novaStavka = new model({ naziv });
      await novaStavka.save();
      res.status(201).json(novaStavka);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get(`/sifrant-${modelName}`, async (req, res) => {
    try {
      const stavke = await model.find();
      res.json(stavke);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Kreiranje ruta za sve šifrante
createRoutesForModel(Kupac, 'kupac');
createRoutesForModel(Mjesto, 'mjesto');
createRoutesForModel(MaterijalVani, 'materijal-vani');
createRoutesForModel(BojaVani, 'boja-vani');
createRoutesForModel(MaterijalUnutra, 'materijal-unutra');
createRoutesForModel(BojaUnutra, 'boja-unutra');
createRoutesForModel(Aplikacija, 'aplikacija');
createRoutesForModel(Model, 'model');
createRoutesForModel(Staklo, 'staklo');

module.exports = router;
