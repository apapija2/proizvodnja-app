const mongoose = require('mongoose');

const StakloSchema = new mongoose.Schema({
  naziv: { type: String, required: true }
}, {
  collection: 'staklos'  // Kolekcija u bazi podataka
});

module.exports = mongoose.model('Staklo', StakloSchema);
