const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // e.g., prodaja, tehnicka_priprema, cnc, etc.
});

module.exports = mongoose.model('User', UserSchema);
