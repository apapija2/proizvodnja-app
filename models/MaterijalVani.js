const mongoose = require('mongoose');

const MaterijalVaniSchema = new mongoose.Schema({
  naziv: { type: String, required: true }
}, {
  collection: 'materijalvanis'  // Kolekcija u bazi podataka
});

module.exports = mongoose.model('MaterijalVani', MaterijalVaniSchema);
