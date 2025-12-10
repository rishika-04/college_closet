import express from 'express';
import mongoose from 'mongoose';

import User from '../models/user.js';
import Review from '../models/review.js';
import Product from '../models/product.js';

const router = express.Router();

// -------------------------------------
// ADD REVIEW
// -------------------------------------
router.post('/addReview', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send('Login required');
    }

    const userEmail = req.session.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) return res.status(404).send('User not found');

    const { product_id, rating, review } = req.body;

    // Validate product exists
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).send('Product not found');

    // Create new review
    const newReview = new Review({
      product_id,
      user_id: user._id,
      rating,
      review,
      created_at: new Date()
    });

    await newReview.save();

    res.status(200).json({
      success: true,
      message: 'Review added successfully'
    });

  } catch (err) {
    console.error("Review Error:", err);
    res.status(500).json({
      success: false,
      message: 'Error adding review'
    });
  }
});

export default router;
