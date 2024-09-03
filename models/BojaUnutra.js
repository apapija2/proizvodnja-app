const mongoose = require('mongoose');

const BojaUnutraSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('BojaUnutra', BojaUnutraSchema);
