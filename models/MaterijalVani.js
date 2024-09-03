const mongoose = require('mongoose');

const MaterijalVaniSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('MaterijalVani', MaterijalVaniSchema);
