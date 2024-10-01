const mongoose = require('mongoose');

const kupacSchema = new mongoose.Schema({
  naziv: { type: String, required: true }
});

module.exports = mongoose.model('Kupac', kupacSchema);

