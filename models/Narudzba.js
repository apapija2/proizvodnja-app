const mongoose = require('mongoose');

const NarudzbaSchema = new mongoose.Schema({
  datumNarudzbe: { type: Date, required: true },
  planiratniZavrsetak: { type: Date, required: true },
  imeKupca: { type: mongoose.Schema.Types.ObjectId, ref: 'Kupac', default: null },
  mjestoKupca: { type: mongoose.Schema.Types.ObjectId, ref: 'Mjesto', default: null },
  materijalVani: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterijalVani', default: null },
  bojaVani: { type: mongoose.Schema.Types.ObjectId, ref: 'BojaVani', default: null },
  materijalUnutra: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterijalUnutra', default: null },
  bojaUnutra: { type: mongoose.Schema.Types.ObjectId, ref: 'BojaUnutra', default: null },
  aplikacija: { type: mongoose.Schema.Types.ObjectId, ref: 'Aplikacija', default: null },
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', default: null },
  staklo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staklo', default: null },
  dimenzije: { type: String, required: true },
  kolicina: { type: Number, required: true },
  napomena: { type: String },
  izvedba: { type: String },
  status: {
    type: String,
    enum: ['Odbijeno', 'Na čekanju', 'Prihvaćeno'], // Status može biti jedna od ovih opcija
    default: 'Na čekanju'
  }
}, {
  collection: 'narudzbas'  // Kolekcija u bazi podataka
});

module.exports = mongoose.model('Narudzba', NarudzbaSchema);
