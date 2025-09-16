const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');
const Vendor = require('../models/Vendor');

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
router.post('/:vendorId', protect, async (req, res) => {
  const { rating, comment } = req.body;
  
  try {
    const vendor = await Vendor.findById(req.params.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Create and save the new review
    const review = new Review({
      rating: Number(rating),
      comment,
      vendorId: req.params.vendorId,
      userId: req.user.id,
    });
    await review.save();

    // After saving, recalculate the vendor's average rating
    const reviews = await Review.find({ vendorId: req.params.vendorId });
    vendor.numReviews = reviews.length;
    vendor.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await vendor.save();

    res.status(201).json({ message: 'Review added successfully' });

  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;