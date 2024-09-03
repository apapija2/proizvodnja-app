const mongoose = require('mongoose');

const StakloSchema = new mongoose.Schema({
  naziv: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Staklo', StakloSchema);
