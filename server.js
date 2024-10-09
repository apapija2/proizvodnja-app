
require('dotenv').config(); // Učitavanje .env datoteke

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Uvozi rute
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product'); // Ruta za proizvode
const sifrantiRoute = require('./routes/sifranti'); // Ruta za šifrante
const narudzbeRoute = require('./routes/narudzbe'); // Ruta za narudžbe


// Uvozi modele
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
const authorizeRole = require('./middleware/authorizeRole');
const session = require('express-session');
const User = require('./models/User');
// Inicijaliziraj Express aplikaciju
const app = express();

// Postavi view engine na EJS
app.set('view engine', 'ejs');
app.set('views', './views'); 

// Parsiraj JSON i URL-encoded podatke iz zahtjeva
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Postavi statičke datoteke
app.use(express.static('public'));
// API rute
app.use('/api/user', authRoute); // Ruta za autentifikaciju
app.use('/api/product', productRoute); // Ruta za proizvode
app.use('/api/sifranti', sifrantiRoute); // Ruta za šifrante
app.use('/api/narudzbe', narudzbeRoute); // Ruta za narudžbe
app.use('/narudzbe', narudzbeRoute);

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',  // Ensure SESSION_SECRET is set in .env
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to true if using HTTPS
}));

// Middleware to populate user session
app.use((req, res, next) => {
  // Skip the check for login and registration routes
  if (req.path === '/login' || req.path === '/register') {
    return next();
  }

  if (!req.session.user) {
    return res.redirect('/login');  // Redirect if not authenticated
  }

  res.locals.user = req.session.user;  // Pass user info to views
  next();
});

// Route for the dashboard
app.get('/', async (req, res) => {
  try {
    const narudzbe = await Narudzba.find()
      .populate('kupac')
      .populate('mjestoKupca')
      .populate('bojaVani')
      .populate('bojaUnutra')
      .populate('materijalVani')
      .populate('materijalUnutra')
      .populate('model')
    
      .populate('tehnickaPriprema')
      .populate('cnc')
      .populate('farbara')

      .populate('staklo')
      .populate('ljepljenje')
      .populate('zavrsavanje');
    
    res.render('index', { narudzbe });
  } catch (error) {
    console.error('Error fetching orders: ', error);
    res.status(500).send('Error fetching orders.');
  }
});

const methodOverride = require('method-override');
app.use(methodOverride('_method'));


app.use('/login', authRoute); // Use auth routes for login
app.get('/login', (req, res) => {
  res.render('login');  // This should render login.ejs from the views folder
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.user = { id: user._id, username: user.username, role: user.role };
      res.redirect('/');
    } else {
      console.error('Invalid credentials');
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).send('Internal server error');
  }
});





// Ruta za narudžbe (GET)
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

// Route to render the form for adding a new order (must come before /narudzbe/:id)
// Route to render the form for adding a new order (must come before /narudzbe/:id)
app.get('/narudzbe/new', async (req, res) => {
  try {
    const kupci = await Kupac.find();
    const mjesta = await Mjesto.find();
    const materijaliVani = await MaterijalVani.find();
    const bojeVani = await BojaVani.find();
    const materijaliUnutra = await MaterijalUnutra.find();
    const bojeUnutra = await BojaUnutra.find();
    const aplikacije = await Aplikacija.find();
    const modeli = await Model.find();
    const stakla = await Staklo.find();

    res.render('new', {
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
    console.error('Greška pri dohvaćanju podataka:', error);  // Log the full error
    res.status(500).send('Greška pri dohvaćanju podataka.');
  }
});

// Route to handle form submission
app.post('/narudzbe', async (req, res) => {
  try {
    const { datumNarudzbe, kupac, mjestoKupca, materijalVani, bojaVani, materijalUnutra, bojaUnutra, aplikacija, model, staklo, dimenzije, kolicina, napomena, planiratniZavrsetak, status } = req.body;

    const novaNarudzba = new Narudzba({
      datumNarudzbe,
      planiratniZavrsetak,
      kupac,
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
      status,
    });

    await novaNarudzba.save();
    res.redirect('/narudzbe');  // Redirect to the order listing after adding
  } catch (error) {
    console.error('Greška pri spremanju narudžbe:', error.message);
    res.status(500).send('Greška pri spremanju narudžbe.');
  }
});
// Ensure you pass the kupci data to the view when rendering the edit page

// Route to display individual order details
app.get('/narudzbe/:id', async (req, res) => {
  try {
    const narudzba = await Narudzba.findById(req.params.id)
      .populate('kupac')
      .populate('mjestoKupca')
      .populate('materijalVani')
      .populate('bojaVani')
      .populate('materijalUnutra')
      .populate('bojaUnutra')
      .populate('aplikacija')
      .populate('model')
      .populate('staklo');

    if (!narudzba) {
      return res.status(404).send('Narudžba nije pronađena.');
    }

    res.render('details', { narudzba });
  } catch (error) {
    console.error('Greška pri dohvaćanju narudžbe:', error.message);
    res.status(500).send('Greška pri dohvaćanju narudžbe.');
  }
});

app.post('/api/narudzbe', async (req, res) => {
  console.log(req.body);  // Dodaj ovo kako bi vidio dolaze li svi podaci ispravno
  try {
    const { datumNarudzbe, planiratniZavrsetak, kupac, mjestoKupca, materijalVani, bojaVani, materijalUnutra, bojaUnutra, aplikacija, model, staklo, dimenzije, kolicina, napomena, izvedba, status } = req.body;

    const novaNarudzba = new Narudzba({
      datumNarudzbe,
      planiratniZavrsetak,
      kupac,  // Ovo mora postojati u req.body
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
    res.status(201).send('Narudžba uspješno kreirana');
  } catch (error) {
    res.status(400).send('Greška pri kreiranju narudžbe: ' + error.message);
  }
});


app.get('/api/narudzbas', async (req, res) => {
  try {
    const narudzbas = await Narudzba.find();F
    res.json(narudzbas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch narudžbe' });
  }
});

app.get('/api/product', async (req, res) => {
  try {
    const narudzbe = await Narudzba.find().populate('kupac').populate('mjestoKupca');
    res.json(narudzbe); // Vraća sve narudžbe kao JSON
  } catch (error) {
    res.status(500).send('Greška pri dohvaćanju narudžbi: ' + error.message);
  }
});

app.get('/narudzbe/:id', async (req, res) => {
  try {
    const narudzba = await Narudzba.findById(req.params.id)
      .populate('kupac')
      .populate('mjestoKupca')
      .populate('materijalVani')
      .populate('bojaVani')
      .populate('materijalUnutra')
      .populate('bojaUnutra')
      .populate('aplikacija')
      .populate('staklo')
      .populate('model');

    if (!narudzba) {
      return res.status(404).send('Narudžba nije pronađena');
    }

    res.render('narudzba-detalji', { narudzba });
  } catch (error) {
    res.status(500).send('Greška pri dohvaćanju narudžbe: ' + error.message);
  }
});


app.get('/api/narudzbe', async (req, res) => {
  try {
    const narudzbe = await Narudzba.find()
      .populate('kupac')

      .populate('materijalVani')
      .populate('bojaVani')
      .populate('materijalUnutra')
      .populate('bojaUnutra')
      .populate('aplikacija')
      
      .populate('model')
      .populate('staklo')

      .populate('mjestoKupca')
      .populate('tehnickaPriprema')
      .populate('cnc')
      .populate('farbara');
    res.json(narudzbe);
  } catch (error) {
    res.status(500).send('Greška pri dohvaćanju narudžbi: ' + error.message);
  }
});
// Role-based redirection from /narudzbe/:id/edit
app.get('/narudzbe/:id/edit', async (req, res) => {
  try {
    const narudzba = await Narudzba.findById(req.params.id).populate('kupac');

    // Assuming user role is saved in the session
    const userRole = req.session.user.role;

    switch (userRole) {
      case 'prodaja':
        return res.render('narudzba-edit', { narudzba });
      case 'cnc':
        return res.redirect(`/cnc`);
      case 'tehnicka-priprema':
        return res.redirect(`/tehnicka-priprema/${narudzba._id}`);
      case 'aplikacija-wj':
        return res.redirect(`/aplikacija-wj/${narudzba._id}`);
      case 'farbara':
        return res.redirect(`/farbara/${narudzba._id}`);
      default:
        return res.render('narudzba-edit', { narudzba });
    }
  } catch (error) {
    console.error('Error fetching order data:', error);
    res.status(500).send('Error fetching order data');
  }
});




// Ruta za šifrant kupca (GET)
app.get('/sifrant-kupac', async (req, res) => {
  try {
    const kupci = await Kupac.find();
    res.render('sifrant-kupac', { kupci });
  } catch (error) {
    res.status(500).send('Greška pri dohvaćanju kupaca');
  }
});

// Ruta za dodavanje kupca (POST)
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


// Ruta za tehničke korisnike
app.get('/tehnicka-priprema', async (req, res) => {
  try {
    const narudzbas = await Narudzba.find()
      .populate('kupac')
      .populate('mjestoKupca')
      .populate('materijalVani')
      .populate('bojaVani')
      .populate('materijalUnutra')
      .populate('bojaUnutra')
      .populate('aplikacija')
      .populate('model')
      .populate('staklo');

    res.render('tehnicka-priprema', { narudzbas });
  } catch (error) {
    console.error('Greška pri dohvaćanju narudžbi:', error.message);
    res.status(500).send('Greška pri dohvaćanju podataka o narudžbama');
  }
});



app.put('/api/narudzba/:id/tehnicka-priprema', async (req, res) => {
  try {
    const { status, zavrseno } = req.body;
    const narudzba = await Narudzba.findById(req.params.id);
    
    if (!narudzba) {
      return res.status(404).json({ error: 'Narudžba nije pronađena' });
    }

    if (zavrseno > narudzba.kolicina) {
      return res.status(400).json({ error: 'Broj završenih komada ne može biti veći od ukupne količine' });
    }

    // Ažuriraj tehničku pripremu
    narudzba.tehnickaPriprema = { status, zavrseno };
    await narudzba.save();
    
    res.status(200).json({ message: 'Tehnička priprema uspješno ažurirana' });
  } catch (error) {
    res.status(500).json({ error: 'Greška pri ažuriranju tehničke pripreme: ' + error.message });
  }
});



// Rute za HTML datoteke
// Remove verifyToken middleware
app.get('/cnc', async (req, res) => {
  try {
    const narudzba = await Narudzba.findById(req.params.id)
      .populate('kupac')
      .populate('mjestoKupca');

    res.render('cnc', { narudzba });
  } catch (error) {
    res.status(500).send('Error fetching CNC data.');
  }
});

app.post('/cnc', async (req, res) => {
  try {
    const { productId, status, zavrseno } = req.body;
    const narudzba = await Narudzba.findById(productId);
    if (!narudzba) {
      return res.status(404).json({ error: 'Narudžba nije pronađena' });
    }

    if (zavrseno > narudzba.kolicina) {
      return res.status(400).json({ error: 'Broj završenih komada ne može biti veći od ukupne količine' });
    }

    narudzba.cnc = { status, zavrseno };
    await narudzba.save();
    res.redirect('/cnc');
  } catch (error) {
    res.status(500).send('Greška pri ažuriranju CNC podataka');
  }
});

// Aplikacija WJ routes
app.get('/aplikacija-wj', authorizeRole(['aplikacija-wj']), async (req, res) => {
  try {
    const narudzbas = await Narudzba.find().populate('kupac').populate('mjestoKupca');
    res.render('aplikacija-wj', { narudzbas });
  } catch (error) {
    res.status(500).send('Greška pri dohvaćanju podataka o narudžbama');
  }
});


app.post('/aplikacija-wj', async (req, res) => {
  try {
    const { productId, status, zavrseno } = req.body;
    const narudzba = await Narudzba.findById(productId);
    if (!narudzba) return res.status(404).json({ error: 'Narudžba nije pronađena' });
    if (zavrseno > narudzba.kolicina) return res.status(400).json({ error: 'Broj završenih komada ne može biti veći od ukupne količine' });
    narudzba.aplikacijaWJ = { status, zavrseno };
    await narudzba.save();
    res.redirect('/aplikacija-wj');
  } catch (error) {
    res.status(500).send('Greška pri ažuriranju podataka za Aplikacija WJ');
  }
});

// Farbara routes
app.get('/farbara' , authorizeRole(['farbara']), async (req, res) => {
  try {
    const narudzbas = await Narudzba.find().populate('kupac').populate('mjestoKupca');
    res.render('farbara', { narudzbas });
  } catch (error) {
    res.status(500).send('Greška pri dohvaćanju podataka o narudžbama');
  }
});

app.post('/farbara', async (req, res) => {
  try {
    const { productId, status, zavrseno } = req.body;
    const narudzba = await Narudzba.findById(productId);
    if (!narudzba) return res.status(404).json({ error: 'Narudžba nije pronađena' });
    if (zavrseno > narudzba.kolicina) return res.status(400).json({ error: 'Broj završenih komada ne može biti veći od ukupne količine' });
    narudzba.farbara = { status, zavrseno };
    await narudzba.save();
    res.redirect('/farbara');
  } catch (error) {
    res.status(500).send('Greška pri ažuriranju podataka za Farbara');
  }
});

// Staklo Route
app.get('/staklo', authorizeRole(['staklo']), async (req, res) => {
  try {
    const narudzbas = await Narudzba.find().populate('kupac').populate('mjestoKupca');
    res.render('staklo', { narudzbas });
  } catch (error) {
    console.error('Greška pri dohvaćanju narudžbi:', error.message);
    res.status(500).send('Greška pri dohvaćanju podataka o narudžbama');
  }
});

app.post('/staklo', async (req, res) => {
  try {
    const { productId, status, zavrseno } = req.body;

    // Update the status and zavrseno for the specific narudzba
    await Narudzba.findByIdAndUpdate(productId, {
      $set: {
        'statusStaklo.status': status,
        'statusStaklo.zavrseno': zavrseno
      }
    });

    res.redirect('/staklo');
  } catch (error) {
    console.error('Error updating staklo status:', error.message);
    res.status(500).send('Error updating staklo status');
  }
});

// Ljepljenje Route
app.get('/ljepljenje', authorizeRole(['ljepljenje']), async (req, res) => {
  try {
    const narudzbas = await Narudzba.find().populate('kupac').populate('mjestoKupca');
    res.render('ljepljenje', { narudzbas });
  } catch (error) {
    console.error("Greška pri dohvaćanju narudžbi:", error.message);
    res.status(500).send('Greška pri dohvaćanju podataka o narudžbama');
  }
});

app.post('/ljepljenje', async (req, res) => {
  try {
    const { productId, status, zavrseno } = req.body;

    await Narudzba.findByIdAndUpdate(productId, {
      $set: {
        'ljepljenje.status': status,
        'ljepljenje.zavrseno': zavrseno
      }
    });

    res.redirect('/ljepljenje');
  } catch (error) {
    console.error('Error updating ljepljenje status:', error.message);
    res.status(500).send('Error updating ljepljenje status');
  }
});

// Završavanje routes
app.get('/zavrsavanje', authorizeRole(['zavrsavanje']), async (req, res) => {
  try {
    const narudzbas = await Narudzba.find().populate('kupac').populate('mjestoKupca');
    res.render('zavrsavanje', { narudzbas });
  } catch (error) {
    res.status(500).send('Greška pri dohvaćanju podataka o narudžbama');
  }
});

app.post('/zavrsavanje', async (req, res) => {
  try {
    const { productId, status, zavrseno } = req.body;
    const narudzba = await Narudzba.findById(productId);
    if (!narudzba) return res.status(404).json({ error: 'Narudžba nije pronađena' });
    if (zavrseno > narudzba.kolicina) return res.status(400).json({ error: 'Broj završenih komada ne može biti veći od ukupne količine' });
    narudzba.zavrsavanje = { status, zavrseno };
    await narudzba.save();
    res.redirect('/zavrsavanje');
  } catch (error) {
    res.status(500).send('Greška pri ažuriranju podataka za Završavanje');
  }
});

app.get('/sifrant-proizvodnja-user', (req, res) => {
  res.render('sifrant-proizvodnja-user');  // Renders your EJS file
});


// Render the edit form
// Edit route for rendering the form with pre-filled data
// Edit route with redirect based on role

app.post('/cnc/:id', async (req, res) => {
  try {
    const { status, zavrseno } = req.body;
    const narudzba = await Narudzba.findById(req.params.id);

    if (!narudzba) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (zavrseno > narudzba.kolicina) {
      return res.status(400).json({ error: 'Completed quantity cannot exceed total quantity' });
    }

    // Update CNC data
    narudzba.cnc = { status, zavrseno };
    await narudzba.save();

    res.redirect(`/cnc/${narudzba._id}`);
  } catch (error) {
    res.status(500).send('Error updating CNC data');
  }
});




// Update an order
// Route to handle updating an order (PUT request)
app.put('/narudzbe/:id', async (req, res) => {
  try {
    // Extract the form data from req.body
    const {
      sifraProizvoda,
      datumNarudzbe,
      planiraniZavrsetak,
      kupac,
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
      status
    } = req.body;

    // Update the order in the database
    await Narudzba.findByIdAndUpdate(req.params.id, {
      sifraProizvoda,
      datumNarudzbe,
      planiraniZavrsetak,
      kupac,
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
      status
    });

    // Redirect back to the list of orders after updating
    res.redirect('/narudzbe');
  } catch (error) {
    console.error('Error updating the order:', error);
    res.status(500).send('Error updating order.');
  }
});


// Delete an order
app.delete('/narudzbe/:id', async (req, res) => {
  try {
    await Narudzba.findByIdAndDelete(req.params.id);
    res.redirect('/narudzbe');  // Redirect after deleting
  } catch (error) {
    console.error('Error deleting narudžba:', error);
    res.status(500).send('Error deleting narudžba.');
  }
});





const authRoutes = require('./routes/auth');
app.use('/', authRoutes); // Use your auth routes for handling login submission





// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/proizvodnja', {}).then(() => {
  console.log('Connected to DB');
}).catch((err) => {
  console.error('Connection error', err);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});