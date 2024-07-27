var express = require('express');
var router = express.Router();
const Product = require('../models/produk');
const { authenticate, authorize } = require('../middleware/auth');
const Cart = require('../models/cart');
const Order = require('../models/order');

//hanya admin yang bisa megelola data barang
router.post('/', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { productName, price } = req.body;
        const newProduct = await Product.create({ productName, price });
        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
});

router.get('/', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        next(err);
    }
});

   router.put('/:productID', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { productName, price } = req.body;
        const product = await Product.findByPk(req.params.productID);
        if (product) {
            product.productName = productName;
            product.price = price;
            await product.save();
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        next(err);
    }
});

router.delete('/:productID', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.productID);
        if (product) {
            await product.destroy();
            res.json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        next(err);
    }
});

//user bisa memasukan barangke keranjang dan membuat pesanan
router.post('/cart', async (req, res, next) => {
    try {
        const { productID, jumlah } = req.body;
        const newProduct = await Cart.create({ productID, jumlah });
        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
});

router.post('/order', async (req, res, next) => {
    try {
        const { cartID } = req.body;
        const cart = await Cart.findByPk(cartID);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const jumlahdibeli = cart.jumlah;
        const idproduknya = cart.productID;
        const product = await Product.findByPk(idproduknya);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const harganya = product.price;
        const totalnya = harganya * jumlahdibeli;
        const newOrder = await Order.create({ cartID, Harga: totalnya });
        res.status(201).json(newOrder);
    } catch (err) {
        next(err);
    }
});

module.exports = router;