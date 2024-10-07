const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authorizeRole'); // Correct import for authorizeRole

// Dodavanje novog proizvoda (samo prodaja)
router.post('/', async (req, res) => {
  const { sifraProizvoda, imeProizvoda } = req.body;
  const postojiProizvod = await Product.findOne({ sifraProizvoda });
  if (postojiProizvod) return res.status(400).json({ error: 'Proizvod s ovom šifrom već postoji.' });
  
  const noviProizvod = new Product({ sifraProizvoda, imeProizvoda });
  await noviProizvod.save();
  res.status(201).json(noviProizvod);
});

// Dohvaćanje svih proizvoda (za dashboard)
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Ažuriranje statusa tehničke pripreme


router.put('/:id/tehnicka-priprema', authorizeRole(['tehnicka-priprema']), async (req, res) => {
    try {
      const { status, zavrseno } = req.body;
      const narudzba = await Narudzba.findById(req.params.id);
      if (!narudzba) return res.status(404).json({ error: 'Narudžba nije pronađena' });
  
      if (zavrseno > narudzba.kolicina) return res.status(400).json({ error: 'Broj završenih komada ne može biti veći od ukupne količine' });
  
      narudzba.tehnickaPriprema = { status, zavrseno };
      await narudzba.save();
      res.status(200).json({ message: 'Tehnička priprema uspješno ažurirana' });
    } catch (error) {
      res.status(500).json({ error: 'Greška pri ažuriranju tehničke pripreme' });
    }
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
