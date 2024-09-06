const mongoose = require('mongoose');

const MjestoSchema = new mongoose.Schema({
  naziv: { type: String, required: true, unique: true }  // Naziv mjesta mora biti jedinstven i obavezan
}, {
  collection: 'mjestos'
});

module.exports = mongoose.model('Mjesto', MjestoSchema);
