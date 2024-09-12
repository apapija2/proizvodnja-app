const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    sifraProizvoda: { type: String, required: true, unique: true },
    datumNarudzbe: { type: Date, required: true },
    planiratniZavrsetak: { type: Date, required: true },

    kupac: { type: mongoose.Schema.Types.ObjectId, ref: 'Kupac', default: null },
    // Ako je povezano s kolekcijom Mjesto, koristi ObjectId; ako nema veze, može biti string
    mjestoKupca: { type: mongoose.Schema.Types.ObjectId, ref: 'Mjesto', default: null },
    
    // Isto vrijedi za materijalVani i bojaVani - referenciraj ili koristi string ako nema veze
    materijalVani: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterijalVani', default: null },
    bojaVani: { type: mongoose.Schema.Types.ObjectId, ref: 'BojaVani', default: null },
    
    materijalUnutra: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterijalUnutra', default: null },
    bojaUnutra: { type: mongoose.Schema.Types.ObjectId, ref: 'BojaUnutra', default: null },
    
    aplikacija: { type: mongoose.Schema.Types.ObjectId, ref: 'Aplikacija', default: null },
    model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', default: null },
    staklo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staklo', default: null },
    dimenzije: { type: String },
    kolicina: { type: Number },
    napomena: { type: String },
    izvedba: { type: String },
    status: { type: String},
    tehnickaPriprema: {
        status: String,
        zavrseno: Number
    },
    cnc: {
        status: String,
        zavrseno: Number
    },
    farbara: {
        status: String,
        zavrseno: Number
    },
    aplikacijaWj: {
        status: String,
        zavrseno: Number
    },
    staklo: {
        status: String,
        zavrseno: Number
    },
    ljepljenje: {
        status: String,
        zavrseno: Number
    },
    zavrsavanje: {
        status: String,
        zavrseno: Number
    }
}, {
    collection: 'narudzbas'  // Kolekcija u bazi podataka
  });
  
module.exports = mongoose.model('Product', ProductSchema);
