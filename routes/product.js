const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Product = require('../models/Product');

// Middleware za autorizaciju
function authorize(roles = []) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).send('Access denied');
    }
    next();
  };
}

// Dohvat svih proizvoda (samo za dashboard)
router.get('/', verifyToken, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Dodavanje proizvoda (samo za prodaja)
router.post('/', verifyToken, authorize(['prodaja']), async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.send('Proizvod dodan');
});

// Ažuriranje statusa za svaki dio proizvodnje (autorizacija po ulogama)
router.put(
  '/:id/status',
  verifyToken,
  authorize([
    'tehnicka_priprema',
    'cnc',
    'farbara',
    'aplikacija_wj',
    'staklo',
    'ljepljenje',
    'zavrsavanje',
  ]),
  async (req, res) => {
    const { id } = req.params;
    const { stage, status, zavrseno } = req.body;

    const update = {};
    update[stage] = { status, zavrseno };

    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    res.json(product);
  }
);

module.exports = router;
