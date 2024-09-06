const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const sifrantiRoute = require('./routes/sifranti'); // Šifranti rute
const narudzbeRoute = require('./routes/narudzbe');
const Narudzba = require('./models/Narudzba');
const Kupac = require('./models/Kupac');
const Mjesto = require('./models/Mjesto');
const MaterijalVani = require('./models/MaterijalVani');
const BojaVani = require('./models/BojaVani');
const MaterijalUnutra = require('./models/MaterijalUnutra');
const BojaUnutra = require('./models/BojaUnutra');
const Aplikacija = require('./models/Aplikacija');
const Model = require('./models/Model');

const Staklo = require('./models/Staklo');


const path = require('path');


const app = express();
// Postavljanje EJS-a kao view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Provjerite da je ovo ispravan put

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', authRoute);
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API rute
app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/sifranti', sifrantiRoute);  // Dodano za šifrante
app.use('/api/narudzbe', narudzbeRoute);  // Dodano za narudžbe



// Rute za HTML datoteke
app.get('/tehnicka-priprema', (req, res) => {
  res.render('tehnicka-priprema');  // Renderira tehnicka-priprema.ejs datoteku
});


app.get('/staklo', (req, res) => {
  res.render('staklo');
});

app.get('/cnc', (req, res) => {
  res.render('cnc');
});




app.get('/farbara', (req, res) => {
  res.render('farbara');
});

app.get('/aplikacija-wj', (req, res) => {
  res.render('aplikacija-wj');
});

app.get('/ljepljenje', (req, res) => {
  res.render('ljepljenje');
});

app.get('/zavrsavanje', (req, res) => {
  res.render('zavrsavanje');
});


// Serve views
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/narudzbe', async (req, res) => {
  try {
    const narudzbe = await Narudzba.find()
      .populate('kupac')
      .populate('mjestoKupca')
      .populate('materijalVani')
      .populate('bojaVani')
      .populate('materijalUnutra')
      .populate('bojaUnutra')
      .populate('aplikacija')
      .populate('model')
      .populate('staklo');

    const kupci = await Kupac.find();
    const mjesta = await Mjesto.find();
    const materijaliVani = await MaterijalVani.find();
    const bojeVani = await BojaVani.find();
    const materijaliUnutra = await MaterijalUnutra.find();
    const bojeUnutra = await BojaUnutra.find();
    const aplikacije = await Aplikacija.find();
    const modeli = await Model.find();
    const stakla = await Staklo.find();

    res.render('narudzbe', { 
      narudzbe, 
      kupci, 
      mjesta, 
      materijaliVani, 
      bojeVani, 
      materijaliUnutra, 
      bojeUnutra, 
      aplikacije, 
      modeli, 
      stakla 
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju narudžbi: ", error.message);
    res.status(500).send('Greška pri dohvaćanju podataka o narudžbama');
  }
});

app.post('/narudzbe', async (req, res) => {
  try {
    const { datumNarudzbe, planiratniZavrsetak, imeKupca, mjestoKupca, materijalVani, bojaVani, materijalUnutra, bojaUnutra, aplikacija, model, staklo, dimenzije, kolicina, napomena, izvedba, status } = req.body;

    const novaNarudzba = new Narudzba({
      datumNarudzbe,
      planiratniZavrsetak,
      imeKupca,
      mjestoKupca,
      materijalVani,
      bojaVani,
      materijalUnutra,
      bojaUnutra,
      aplikacija,
      model,
      staklo,
      dimenzije,
      kolicina,
      napomena,
      izvedba,
      status
    });

    await novaNarudzba.save();
    res.redirect('/narudzbe'); // Nakon unosa preusmjerava na listu narudžbi
  } catch (error) {
    console.error("Greška pri unosu narudžbe: ", error.message);
    res.status(500).send('Greška pri unosu narudžbe');
  }
});




// Ruta za šifrant kupca dostupna samo korisnicima s ulogom 'prodaja'
// Ruta za šifrant kupca
app.get('/sifrant-kupac', async (req, res) => {
  try {
      const kupci = await Kupac.find();
      res.render('sifrant-kupac', { kupci });
  } catch (error) {
      res.status(500).send('Greška pri dohvaćanju kupaca');
  }
});

app.post('/sifrant-kupac', async (req, res) => {
  try {
    const postojiKupac = await Kupac.findOne({ naziv: req.body.naziv });
    if (postojiKupac) {
      return res.status(400).send('Kupac s ovim nazivom već postoji!');
    }

    const noviKupac = new Kupac({ naziv: req.body.naziv });
    await noviKupac.save();
    res.redirect('/sifrant-kupac');
  } catch (error) {
    console.error(error);
    res.status(500).send('Greška pri dodavanju kupca');
  }
});

// Ruta za šifrant mjesto (GET)
app.get('/sifrant-mjesto', async (req, res) => {
  try {
    const mjesta = await Mjesto.find();
    res.render('sifrant-mjesto', { mjesta });
  } catch (error) {
    console.error("Greška pri dohvaćanju mjesta: ", error);  // Ispisuje detalje greške
    res.status(500).send('Greška pri dohvaćanju mjesta');
  }
});


  



// Ruta za dodavanje mjesta (POST)
app.post('/sifrant-mjesto', async (req, res) => {
  try {
    console.log(req.body);  // Provjerite što dolazi s forme
    const postojiMjesto = await Mjesto.findOne({ naziv: req.body.naziv });
    if (postojiMjesto) {
      return res.status(400).send('Mjesto s ovim nazivom već postoji!');
    }

    const novoMjesto = new Mjesto({ naziv: req.body.naziv });
    await novoMjesto.save();
    res.redirect('/sifrant-mjesto');
  } catch (error) {
    console.error(error);
    res.status(500).send('Greška pri dodavanju mjesta');
  }
});

// Ruta za šifrant materijala vani
app.get('/sifrant-materijal-vani', async (req, res) => {
  try {
      const materijaliVani = await MaterijalVani.find();
      res.render('sifrant-materijal-vani', { materijaliVani });
  } catch (error) {
      res.status(500).send('Greška pri dohvaćanju materijala vani');
  }
});

app.post('/sifrant-materijal-vani', async (req, res) => {
  try {
      const noviMaterijalVani = new MaterijalVani({ naziv: req.body.naziv });
      await noviMaterijalVani.save();
      res.redirect('/sifrant-materijal-vani');
  } catch (error) {
      console.error(error);
      res.status(500).send('Greška pri dodavanju materijala vani');
  }
});

// Ruta za šifrant boja vani
app.get('/sifrant-boja-vani', async (req, res) => {
  try {
      const bojeVani = await BojaVani.find();
      res.render('sifrant-boja-vani', { bojeVani });
  } catch (error) {
      res.status(500).send('Greška pri dohvaćanju boja vani');
  }
});

app.post('/sifrant-boja-vani', async (req, res) => {
  try {
      const novaBojaVani = new BojaVani({ naziv: req.body.naziv });
      await novaBojaVani.save();
      res.redirect('/sifrant-boja-vani');
  } catch (error) {
      console.error(error);
      res.status(500).send('Greška pri dodavanju boje vani');
  }
});

// Ruta za šifrant materijala unutra
app.get('/sifrant-materijal-unutra', async (req, res) => {
  try {
      const materijaliUnutra = await MaterijalUnutra.find();
      res.render('sifrant-materijal-unutra', { materijaliUnutra });
  } catch (error) {
      res.status(500).send('Greška pri dohvaćanju materijala unutra');
  }
});

app.post('/sifrant-materijal-unutra', async (req, res) => {
  try {
      const noviMaterijalUnutra = new MaterijalUnutra({ naziv: req.body.naziv });
      await noviMaterijalUnutra.save();
      res.redirect('/sifrant-materijal-unutra');
  } catch (error) {
      console.error(error);
      res.status(500).send('Greška pri dodavanju materijala unutra');
  }
});

// Ruta za šifrant boja unutra
app.get('/sifrant-boja-unutra', async (req, res) => {
  try {
      const bojeUnutra = await BojaUnutra.find();
      res.render('sifrant-boja-unutra', { bojeUnutra });
  } catch (error) {
      res.status(500).send('Greška pri dohvaćanju boja unutra');
  }
});

app.post('/sifrant-boja-unutra', async (req, res) => {
  try {
      const novaBojaUnutra = new BojaUnutra({ naziv: req.body.naziv });
      await novaBojaUnutra.save();
      res.redirect('/sifrant-boja-unutra');
  } catch (error) {
      console.error(error);
      res.status(500).send('Greška pri dodavanju boje unutra');
  }
});

// Ruta za šifrant aplikacija
app.get('/sifrant-aplikacija', async (req, res) => {
  try {
      const aplikacije = await Aplikacija.find();
      res.render('sifrant-aplikacija', { aplikacije });
  } catch (error) {
      res.status(500).send('Greška pri dohvaćanju aplikacija');
  }
});

app.post('/sifrant-aplikacija', async (req, res) => {
  try {
      const novaAplikacija = new Aplikacija({ naziv: req.body.naziv });
      await novaAplikacija.save();
      res.redirect('/sifrant-aplikacija');
  } catch (error) {
      console.error(error);
      res.status(500).send('Greška pri dodavanju aplikacije');
  }
});

// Ruta za šifrant model
app.get('/sifrant-model', async (req, res) => {
  try {
      const modeli = await Model.find();
      res.render('sifrant-model', { modeli });
  } catch (error) {
      res.status(500).send('Greška pri dohvaćanju modela');
  }
});

app.post('/sifrant-model', async (req, res) => {
  try {
      const noviModel = new Model({ naziv: req.body.naziv });
      await noviModel.save();
      res.redirect('/sifrant-model');
  } catch (error) {
      console.error(error);
      res.status(500).send('Greška pri dodavanju modela');
  }
});

// Ruta za šifrant staklo
app.get('/sifrant-staklo', async (req, res) => {
  try {
      const stakla = await Staklo.find();
      res.render('sifrant-staklo', { stakla });
  } catch (error) {
      res.status(500).send('Greška pri dohvaćanju stakla');
  }
});

app.post('/sifrant-staklo', async (req, res) => {
  try {
      const novoStaklo = new Staklo({ naziv: req.body.naziv });
      await novoStaklo.save();
      res.redirect('/sifrant-staklo');
  } catch (error) {
      console.error(error);
      res.status(500).send('Greška pri dodavanju stakla');
  }
});


















app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! Check the server logs for details.');
});



mongoose
  .connect('mongodb://127.0.0.1:27017/proizvodnja', {
    // Opcije za Mongoose su uklonjene jer su deprecated
  })
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('Connection error', err));

app.listen(3000, () => console.log('Server running on port 3000'));
