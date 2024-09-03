const mongoose = require('mongoose');

const AplikacijaSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Aplikacija', AplikacijaSchema);
