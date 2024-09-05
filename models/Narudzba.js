const mongoose = require('mongoose');

const NarudzbaSchema = new mongoose.Schema({
  sifraProizvoda: { type: String, required: true, unique: true },
  datumNarudzbe: { type: Date, required: true },
  planiraniZavrsetak: { type: Date, required: true },
  kupac: { type: mongoose.Schema.Types.ObjectId, ref: 'Kupac', required: true },
  mjestoKupca: { type: mongoose.Schema.Types.ObjectId, ref: 'Mjesto', required: true },
  materijalVani: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterijalVani', required: true },
  bojaVani: { type: mongoose.Schema.Types.ObjectId, ref: 'BojaVani', required: true },
  materijalUnutra: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterijalUnutra', required: true },
  bojaUnutra: { type: mongoose.Schema.Types.ObjectId, ref: 'BojaUnutra', required: true },
  aplikacija: { type: mongoose.Schema.Types.ObjectId, ref: 'Aplikacija', required: true },
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true },
  staklo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staklo', required: true },
  dimenzije: { type: String, required: true },
  kolicina: { type: Number, required: true },
  napomena: { type: String },
  izvedba: { type: String },
  statusTehnickaPriprema: { type: String, default: 'Nije u izvedbi' },
  statusCNC: { type: String, default: 'Nije u izvedbi' },
  statusFarbara: { type: String, default: 'Nije u izvedbi' },
  statusAplikacijaWJ: { type: String, default: 'Nije u izvedbi' },
  statusStaklo: { type: String, default: 'Nije u izvedbi' },
  statusLjepljenje: { type: String, default: 'Nije u izvedbi' },
  statusZavrsavanje: { type: String, default: 'Nije u izvedbi' },
  status: { 
    type: String, 
    enum: ['Nije prihvaćeno', 'Na čekanju', 'Prihvaćeno'], 
    default: 'Na čekanju' 
  },
}, { collection: 'products' });  // Ovo definira ime kolekcije "products"

module.exports = mongoose.model('Narudzba', NarudzbaSchema);
