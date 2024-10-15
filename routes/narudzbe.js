const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authorizeRole');
const Narudzba = require('../models/Narudzba');
const Product = require('../models/Product');
const Kupac = require('../models/Kupac'); 

// Fetch all orders
router.get('/', async (req, res) => {
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
          .populate('staklo')
          .populate('tehnickaPriprema')
          .populate('cnc')
          .populate('farbara')
          .populate('statusStaklo')
          .populate('ljepljenje')
          .populate('zavrsavanje');

      res.render('narudzbe', { narudzbe });  // Render the EJS template with data
  } catch (error) {
      console.error('Error fetching orders:', error.message);
      res.status(500).send('Greška pri dohvaćanju narudžbi');
  }
});

// Add a new product (for 'prodaja' role only)
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send('Proizvod dodan');
    } catch (error) {
        res.status(500).send('Greška pri dodavanju proizvoda.');
    }
});

// Fetch all orders
router.get('/', async (req, res) => {
    try {
        const narudzbe = await Narudzba.find();
        res.json(narudzbe);
    } catch (error) {
        res.status(500).send('Greška pri dohvaćanju narudžbi');
    }
});

// Fetch a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        const narudzba = await Narudzba.findById(req.params.id);
        if (!narudzba) return res.status(404).send('Narudžba nije pronađena');
        res.render('narudzba-edit', { narudzba });
    } catch (err) {
        res.status(500).send('Greška pri dohvaćanju narudžbe');
    }
});

// Update an order (restricted to certain roles)
router.post('/:id', authorizeRole(['prodaja', 'tehnicka-priprema', 'cnc']), async (req, res) => {
    try {
        const narudzba = await Narudzba.findById(req.params.id);
        narudzba.status = req.body.status;
        await narudzba.save();
        res.redirect('/narudzbe');
    } catch (err) {
        res.status(500).send('Greška pri ažuriranju narudžbe');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const narudzba = await Narudzba.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect('/narudzbe');
    } catch (error) {
        res.status(500).send('Error updating the order');
    }
});


router.get('/:id/edit', async (req, res) => {
    try {
        // Find the order by its ID
        const narudzba = await Narudzba.findById(req.params.id).populate('kupac');
        
        // Find all customers to populate the dropdown
        const kupci = await Kupac.find(); 

        if (!narudzba) return res.status(404).send('Narudžba nije pronađena');
        
        // Pass both the order (narudzba) and customers (kupci) to the view
        res.render('narudzba-edit', { narudzba, kupci });
    } catch (err) {
        console.error(err);
        res.status(500).send('Greška pri dohvaćanju narudžbe');
    }
});

// Update status for specific production phases
router.put('/:id/:faza', authorizeRole(['cnc', 'farbara', 'tehnicka-priprema', 'aplikacija-wj', 'staklo']), async (req, res) => {
    const { faza } = req.params;
    const { status, zavrseno } = req.body;

    try {
        const narudzba = await Narudzba.findById(req.params.id);
        if (!narudzba) return res.status(404).json({ error: 'Narudžba nije pronađena' });
        if (zavrseno > narudzba.kolicina) return res.status(400).json({ error: 'Završeno ne može biti više od količine' });

        narudzba[faza] = { status, zavrseno };
        await narudzba.save();
        res.json(narudzba);
    } catch (err) {
        res.status(500).send('Greška pri ažuriranju narudžbe');
    }
});

module.exports = router;
