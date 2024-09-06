const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema({
  naziv: { type: String, required: true }
}, {
  collection: 'models'  // Kolekcija u bazi podataka
});

module.exports = mongoose.model('Model', ModelSchema);
