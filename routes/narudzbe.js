const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authorizeRole'); // Pretpostavimo da već imaš ovaj middleware
const Narudzba = require('../models/Narudzba');
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


router.put('/:id/:faza', authorizeRole(['cnc', 'farbara', 'tehnicka-priprema', 'aplikacija-wj', 'staklo']), async (req, res) => {
  const { faza } = req.params;
  const { status, zavrseno } = req.body;
  const narudzba = await Narudzba.findById(req.params.id);
  
  if (!narudzba) return res.status(404).json({ error: 'Narudžba nije pronađena' });
  if (zavrseno > narudzba.kolicina) return res.status(400).json({ error: 'Završeno ne može biti više od količine' });
  
  narudzba[faza] = { status, zavrseno };
  await narudzba.save();
  res.json(narudzba);
});

const userRoles = ['cnc', 'tehnicka-priprema', 'farbara', 'staklo', 'aplikacija-wj']; // Dodaj sve korisničke uloge

router.get('/:role/:id', authorizeRole(userRoles), async (req, res) => {
  try {
    const { role, id } = req.params;
    const narudzba = await Narudzba.findById(id).populate('kupac').populate('mjestoKupca');
    
    if (!narudzba) return res.status(404).send('Narudžba nije pronađena');

    // Renderiranje specifične stranice ovisno o ulozi
    if (userRoles.includes(role)) {
      res.render(role, { narudzba }); // role.ejs će biti specifičan EJS fajl za svaku ulogu
    } else {
      res.status(400).send('Nepoznata uloga');
    }
  } catch (error) {
    res.status(500).send('Greška pri dohvaćanju podataka');
  }
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