const mongoose = require('mongoose');

const BojaUnutraSchema = new mongoose.Schema({
  naziv: { type: String, required: true }
}, {
  collection: 'bojaunutras'  // Kolekcija u bazi podataka
});

module.exports = mongoose.model('BojaUnutra', BojaUnutraSchema);
