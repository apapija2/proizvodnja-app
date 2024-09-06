const mongoose = require('mongoose');

const AplikacijaSchema = new mongoose.Schema({
  naziv: { type: String, required: true }
}, {
  collection: 'aplikacijas'  // Kolekcija u bazi podataka
});

module.exports = mongoose.model('Aplikacija', AplikacijaSchema);
