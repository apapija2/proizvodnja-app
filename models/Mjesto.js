const mongoose = require('mongoose');

const MjestoSchema = new mongoose.Schema({
  ime: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Mjesto', MjestoSchema);
