const mongoose = require('mongoose');

const BojaVaniSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('BojaVani', BojaVaniSchema);
