const express = require('express');
const router = express.Router();
const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');
const verifyToken = require('../middlewares/verifyToken');

// Create Order (Checkout)
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { products, totalAmount, shippingAddress } = req.body;

        // Verify stock for all products
        for (let item of products) {
            const product = await ProductModel.findById(item.product);
            if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
            // For now, we just proceed. Real app would check stock quantity.
            // if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }

        // Create Order
        const newOrder = new OrderModel({
            user: req.user.id,
            products,
            totalAmount,
            shippingAddress
        });

        await newOrder.save();

        // Deduct Stock (Mock implementation - assuming stock field exists and is managed)
        for (let item of products) {
            await ProductModel.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }

        res.json({ message: 'Order placed successfully', order: newOrder });

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Get User Orders
router.get('/getuserorders', verifyToken, (req, res) => {
    OrderModel.find({ user: req.user.id })
        .populate('products.product')
        .sort({ createdAt: -1 })
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err));
});

// Get All Orders (Admin/Seller - simplified for now)
router.get('/getall', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

    OrderModel.find({})
        .populate('user', 'name email')
        .populate('products.product')
        .sort({ createdAt: -1 })
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err));
});

module.exports = router;
