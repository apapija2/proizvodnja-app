const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // Example roles: 'cnc', 'tehnicka-priprema', etc.
});

module.exports = mongoose.model('User', userSchema, 'users');
