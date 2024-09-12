const mongoose = require('mongoose');

// Definicija korisničkog shema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }  // npr. 'admin', 'prodaja', 'tehnicka-priprema'
});

// Eksplicitno definiranje kolekcije 'users'
module.exports = mongoose.model('User', userSchema, 'users');
