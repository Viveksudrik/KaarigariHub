const express = require('express');
const router = express.Router();
const ReviewModel = require('../models/reviewModel');
const ProductModel = require('../models/productModel'); // To potentially update avg rating on product
const verifyToken = require('../middlewares/verifyToken');

// Add Review
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { product, rating, comment } = req.body;

        // Check if user already reviewed this product
        const existingReview = await ReviewModel.findOne({ user: req.user.id, product });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const newReview = new ReviewModel({
            user: req.user.id,
            product,
            rating,
            comment
        });

        await newReview.save();

        res.json(newReview);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Get Product Reviews
router.get('/getbyproduct/:id', async (req, res) => {
    try {
        const reviews = await ReviewModel.find({ product: req.params.id }).populate('user', 'name avatar');

        // Compute average
        let avgRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            avgRating = (sum / reviews.length).toFixed(1);
        }

        res.json({ reviews, avgRating });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
