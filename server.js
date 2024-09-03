const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const sifrantiRoute = require('./routes/sifranti'); // Dodano za šifrante
const narudzbeRoute = require('./routes/narudzbe'); // Dodano za narudžbe
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API rute
app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/sifranti', sifrantiRoute);  // Dodano za šifrante
app.use('/api/narudzbe', narudzbeRoute);  // Dodano za narudžbe

// Rute za HTML datoteke
app.get('/tehnicka-priprema', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'tehnicka-priprema.html'));
});

app.get('/staklo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'staklo.html'));
});

app.get('/cnc', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cnc.html'));
});

app.get('/farbara', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'farbara.html'));
});

app.get('/aplikacija-wj', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'aplikacija-wj.html'));
});

app.get('/ljepljenje', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ljepljenje.html'));
});

app.get('/zavrsavanje', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'zavrsavanje.html'));
});

// Serve views
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/narudzbe', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/narudzbe.html'));  // Prije shifrant, sada narudzbe
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

mongoose
  .connect('mongodb://127.0.0.1:27017/proizvodnja', {
    // Opcije za Mongoose su uklonjene jer su deprecated
  })
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('Connection error', err));

app.listen(3000, () => console.log('Server running on port 3000'));
