const mongoose = require('mongoose');

const BojaVaniSchema = new mongoose.Schema({
  naziv: { type: String, required: true }
}, {
  collection: 'bojavanis'  // Kolekcija u bazi podataka
});

module.exports = mongoose.model('BojaVani', BojaVaniSchema);
