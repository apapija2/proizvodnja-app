const mongoose = require('mongoose');

const KupacSchema = new mongoose.Schema({
  ime: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Kupac', KupacSchema);
