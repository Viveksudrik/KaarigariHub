const express = require('express');
const router = express.Router();
const Model = require('../models/productModel');
const verifyToken = require('../middlewares/verifyToken');

// Add Product - Protected (Sellers/Admins)
router.post('/add', verifyToken, (req, res) => {

    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Sellers only.' });
    }

    const productData = { ...req.body, seller: req.user.id };

    new Model(productData).save()
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

// Get All Products - Advanced Search/Filter/Pagination
router.get('/getall', async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
        let query = {};

        // Search (Title or Description)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }

        // Category Filter
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        // Price Range Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sorting
        let sortOption = {};
        if (sort === 'price_asc') sortOption.price = 1;
        else if (sort === 'price_desc') sortOption.price = -1;
        else if (sort === 'newest') sortOption.createdAt = -1; // Default to newest
        else sortOption.createdAt = -1;

        // Pagination
        const skip = (page - 1) * limit;

        const products = await Model.find(query)
            .populate('seller', 'name email')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const total = await Model.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            totalProducts: total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Get Product by ID - Public
router.get('/getid/:id', (req, res) => {
    Model.findById(req.params.id)
        .populate('seller', 'name email')
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});


// Delete Product - Protected (Owner/Admin)
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const product = await Model.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check ownership or admin status
        if (product.seller && product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await Model.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Update Product - Protected (Owner/Admin)
router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const product = await Model.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check ownership or admin status
        if (product.seller && product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        const result = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(result);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;