const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product'); 

// Middleware to get user from token
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @route   POST /api/reviews/:vendorId
// @desc    Create a new review for a vendor
// @route   POST /api/reviews/:productId
// @desc    Create a new review for a product
router.post('/:productId', protect, async (req, res) => {
  const {rating, comment } = req.body;
  
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
 
    const review = new Review({
      userId: req.user.id,
      vendorId:product.vendorId,
      productId: req.params.productId,
      rating: Number(rating),
      comment,
    });
    await review.save();

    // After saving, recalculate the product's average rating
    const reviews = await Review.find({ productId: req.params.productId });
    const numReviews = reviews.length;
    const avgRating = numReviews > 0
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews
      : 0;  
        product.numReviews = numReviews;
    product.rating = avgRating;
    await product.save();

    res.status(201).json({ message: 'Review added successfully' });

  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId: productId })
      .populate('userId', 'name') // This fetches the reviewer's name from the User collection
      .sort({ createdAt: -1 }); // Show newest reviews first

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;