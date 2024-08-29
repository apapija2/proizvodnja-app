const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const path = require('path');

const app = express();

app.use(express.json());
app.use('/api/user', authRoute);
app.use('/api/product', productRoute);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve views
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});
app.get('/shifrant', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/shifrant.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

mongoose
  .connect('mongodb://127.0.0.1:27017/proizvodnja', {
    // useNewUrlParser: true,    // Ove opcije su deprecated u novijim verzijama Mongoose-a
    // useUnifiedTopology: true  // Ove opcije su deprecated u novijim verzijama Mongoose-a
  })
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('Connection error', err));

app.listen(3000, () => console.log('Server running on port 3000'));
