const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Model', ModelSchema);
