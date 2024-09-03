const mongoose = require('mongoose');

const MaterijalUnutraSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('MaterijalUnutra', MaterijalUnutraSchema);
