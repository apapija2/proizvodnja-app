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
// API rute
const productRoutes = require('./routes/product');
app.use('/api/product', productRoutes);

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




