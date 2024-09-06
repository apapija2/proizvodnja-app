const mongoose = require('mongoose');

const MaterijalUnutraSchema = new mongoose.Schema({
  naziv: { type: String, required: true }
}, {
  collection: 'materijalunutras'  // Kolekcija u bazi podataka
});

module.exports = mongoose.model('MaterijalUnutra', MaterijalUnutraSchema);
