const express = require('express');
const router = express.Router();
const Product = require('../models/Narudzba');
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');

// Dodavanje novog proizvoda (samo prodaja)
router.post('/', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.send('Proizvod dodan');
});


// Ruta za dodavanje proizvodaS
router.post('/', async (req, res) => {
    const { sifraProizvoda, imeProizvoda } = req.body;
    try {
      const noviProizvod = new Product({ sifraProizvoda, imeProizvoda });
      await noviProizvod.save();
      res.status(201).json(noviProizvod);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
// Dohvaćanje svih proizvoda (za dashboard)
router.get('/', verifyToken, async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Ažuriranje statusa tehničke pripreme


router.put('/:id/tehnicka-priprema', verifyToken, authorizeRole(['tehnicka-priprema']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findById(req.params.id);

    if (zavrseno > product.kolicina) {
        return res.status(400).json({ error: 'Broj dovršenih komada ne može biti veći od ukupne količine narudžbe.' });
    }

    product.tehnickaPriprema.status = status;
    product.tehnickaPriprema.zavrseno = zavrseno;
    await product.save();

    res.json(product);
});


// Ažuriranje statusa stakla
router.put('/:id/staklo', verifyToken, authorizeRole(['staklo']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'staklo.status': status, 'staklo.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

// CNC
router.put('/:id/cnc', verifyToken, authorizeRole(['cnc']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'cnc.status': status, 'cnc.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

// Farbara
router.put('/:id/farbara', verifyToken, authorizeRole(['farbara']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'farbara.status': status, 'farbara.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

// Aplikacija-wj
router.put('/:id/aplikacija-wj', verifyToken, authorizeRole(['aplikacija-wj']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'aplikacijaWj.status': status, 'aplikacijaWj.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

// Lijepljenje
router.put('/:id/ljepljenje', verifyToken, authorizeRole(['ljepljenje']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'ljepljenje.status': status, 'ljepljenje.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

// Završavanje
router.put('/:id/zavrsavanje', verifyToken, authorizeRole(['zavrsavanje']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'zavrsavanje.status': status, 'zavrsavanje.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

router.get('/', verifyToken, async (req, res) => {
    try {
      const products = await Product.find();
  
      const updatedProducts = products.map(product => {
        // Izračunaj postotak za svaki dio proizvodnje
        const tehnickaPripremaPercentage = Math.round((product.tehnickaPriprema.zavrseno / product.kolicina) * 100) || 0;
        const cncPercentage = Math.round((product.cnc.zavrseno / product.kolicina) * 100) || 0;
        const farbaraPercentage = Math.round((product.farbara.zavrseno / product.kolicina) * 100) || 0;
        const aplikacijaWjPercentage = Math.round((product.aplikacijaWj.zavrseno / product.kolicina) * 100) || 0;
        const stakloPercentage = Math.round((product.staklo.zavrseno / product.kolicina) * 100) || 0;
        const ljepljenjePercentage = Math.round((product.ljepljenje.zavrseno / product.kolicina) * 100) || 0;
        const zavrsavanjePercentage = Math.round((product.zavrsavanje.zavrseno / product.kolicina) * 100) || 0;
  
        return {
          ...product._doc,
          tehnickaPripremaPercentage,
          cncPercentage,
          farbaraPercentage,
          aplikacijaWjPercentage,
          stakloPercentage,
          ljepljenjePercentage,
          zavrsavanjePercentage,
        };
      });
  
      res.json(updatedProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;