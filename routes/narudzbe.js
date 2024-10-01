const express = require('express');
const router = express.Router();
const Product = require('../models/Narudzba');
const authorizeRole = require('../middleware/authorizeRole');

// Dodavanje novog proizvoda (samo prodaja)
router.post('/', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.send('Proizvod dodan');
});


// Ruta za dodavanje proizvodaS
// Route to fetch all orders
router.get('/', async (req, res) => {
    try {
      const narudzbe = await Narudzba.find().populate('kupac').populate('mjestoKupca');
      res.render('narudzbe', { narudzbe });
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).send('Error fetching orders');
    }
  });
  
  // Route to fetch a specific order by ID
  router.get('/:id', async (req, res) => {
    try {
      const narudzba = await Narudzba.findById(req.params.id);
      res.render('narudzba-edit', { narudzba });
    } catch (err) {
      console.error('Error fetching order:', err);
      res.status(500).send('Error fetching order');
    }
  });
  
  // Route to update the order (only available to certain roles)
  router.post('/:id', authorizeRole(['prodaja', 'tehnicka-priprema']), async (req, res) => {
    try {
      const narudzba = await Narudzba.findById(req.params.id);
      narudzba.status = req.body.status; // Update the status or other details
      await narudzba.save();
      res.redirect('/narudzbe');
    } catch (err) {
      console.error('Error updating order:', err);
      res.status(500).send('Error updating order');
    }
  });
// Ažuriranje statusa tehničke pripreme


router.put('/:id/tehnicka-priprema', authorizeRole(['tehnicka-priprema']), async (req, res) => {
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
router.put('/:id/staklo', authorizeRole(['staklo']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'staklo.status': status, 'staklo.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

// CNC
router.put('/:id/cnc', authorizeRole(['cnc']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'cnc.status': status, 'cnc.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

// Farbara
router.put('/:id/farbara', authorizeRole(['farbara']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'farbara.status': status, 'farbara.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

// Aplikacija-wj
router.put('/:id/aplikacija-wj', authorizeRole(['aplikacija-wj']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'aplikacijaWj.status': status, 'aplikacijaWj.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

// Lijepljenje
router.put('/:id/ljepljenje', authorizeRole(['ljepljenje']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'ljepljenje.status': status, 'ljepljenje.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

// Završavanje
router.put('/:id/zavrsavanje', authorizeRole(['zavrsavanje']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'zavrsavanje.status': status, 'zavrsavanje.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

router.get('/', async (req, res) => {
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