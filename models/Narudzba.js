const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const narudzbaSchema = new mongoose.Schema({
  sifraProizvoda: { type: Number },
  datumNarudzbe: { type: Date, required: true },
  planiratniZavrsetak: { type: Date, required: true },
  kupac: { type: mongoose.Schema.Types.ObjectId, ref: 'Kupac', required: true },
  mjestoKupca: { type: mongoose.Schema.Types.ObjectId, ref: 'Mjesto', required: true },
  materijalVani: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterijalVani' },
  bojaVani: { type: mongoose.Schema.Types.ObjectId, ref: 'BojaVani' },
  materijalUnutra: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterijalUnutra' },
  bojaUnutra: { type: mongoose.Schema.Types.ObjectId, ref: 'BojaUnutra' },
  aplikacija: { type: mongoose.Schema.Types.ObjectId, ref: 'Aplikacija' },
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
  staklo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staklo' },  // Polje za referencu na staklo model
  dimenzije: { type: String, required: true },
  kolicina: { type: Number, required: true },
  napomena: { type: String },
  izvedba: { type: String },
  status: { type: String, default: 'Na čekanju' },
  tehnickaPriprema: {
    status: { type: String, default: 'Nije započeto' },
    zavrseno: { type: Number, default: 0 }
  },
  cnc: {
    status: { type: String, default: 'Nije započeto' },
    zavrseno: { type: Number, default: 0 }
  },
  farbara: {
    status: { type: String, default: 'Nije započeto' },
    zavrseno: { type: Number, default: 0 }
  },
  aplikacijaWJ: {  // Ovdje koristimo ispravno ime za aplikaciju-wj
    status: { type: String, default: 'Nije započeto' },
    zavrseno: { type: Number, default: 0 }
  },
  statusStaklo: {  // Preimenovano kako bi izbjegli konflikt sa staklo referencom
    status: { type: String, default: 'Nije započeto' },
    zavrseno: { type: Number, default: 0 }
  },
  ljepljenje: {
    status: { type: String, default: 'Nije započeto' },
    zavrseno: { type: Number, default: 0 }
  },
  zavrsavanje: {
    status: { type: String, default: 'Nije započeto' },
    zavrseno: { type: Number, default: 0 }
  }
});

// Automatsko inkrementiranje za polje 'sifraProizvoda'
narudzbaSchema.plugin(AutoIncrement, { inc_field: 'sifraProizvoda' });

module.exports = mongoose.model('Narudzba', narudzbaSchema);
