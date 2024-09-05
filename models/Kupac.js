const mongoose = require('mongoose');

const KupacSchema = new mongoose.Schema({
  naziv: { type: String, required: true, unique: true }  // Osigurava da "naziv" mora biti jedinstven i ne smije biti prazan
}, {
  collection: 'kupacs'  // Kolekcija u bazi podataka
});

module.exports = mongoose.model('Kupac', KupacSchema);
