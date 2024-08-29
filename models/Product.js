const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  sifraProizvoda: { type: String, required: true, unique: true },
  datumNarudzbe: { type: Date, required: true },
  imeKupca: { type: String, required: true },
  mjestoKupca: { type: String },
  materijalVani: { type: String },
  bojaVani: { type: String },
  materijalUnutra: { type: String },
  bojaUnutra: { type: String },
  aplikacija: { type: String },
  model: { type: String },
  staklo: { type: String },
  dimenzije: { type: String },
  kolicina: { type: Number },
  napomena: { type: String },
  izvedba: { type: String },
  tehnickaPriprema: {
    status: String,
    zavrseno: Number,
  },
  cnc: {
    status: String,
    zavrseno: Number,
  },
  farbara: {
    status: String,
    zavrseno: Number,
  },
  aplikacijaWj: {
    status: String,
    zavrseno: Number,
  },
  staklo: {
    status: String,
    zavrseno: Number,
  },
  ljepljenje: {
    status: String,
    zavrseno: Number,
  },
  zavrsavanje: {
    status: String,
    zavrseno: Number,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
