const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyToken = require('../middleware/verifyToken');
const authorizeRole = require('../middleware/authorizeRole');

// Dodavanje novog proizvoda (samo prodaja)
router.post('/', verifyToken, authorizeRole(['prodaja']), async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.send('Proizvod dodan');
});

// Dohvaćanje svih proizvoda (za dashboard)
router.get('/', verifyToken, async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Ažuriranje statusa tehničke pripreme
router.put('/:id/tehnicka-priprema', verifyToken, authorizeRole(['tehnicka-priprema']), async (req, res) => {
    const { status, zavrseno } = req.body;
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { 'tehnickaPriprema.status': status, 'tehnickaPriprema.zavrseno': zavrseno },
        { new: true }
    );
    res.json(product);
});

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

module.exports = router;
