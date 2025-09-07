const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// @route   GET /api/vendors
// @desc    Search for vendors based on location and other filters
router.get('/', async (req, res) => {
  try {
    const { lat, lng, category, q } = req.query;
    const maxDistance = 10000; // Search within 10km

    // Base query object
    let query = {};

    // If location is provided, add geospatial query
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)], // IMPORTANT: Longitude first, then Latitude
          },
          $maxDistance: maxDistance,
        },
      };
    }
    
    // If a search query 'q' is provided, add text search
    if (q) {
        // Simple regex search on business name and description
        query.$or = [
            { businessName: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ];
    }
    
    // If category is provided, add category filter
    // Note: You'll need to add a 'category' field to your Vendor schema for this to work
    // if (category) {
    //   query.category = category;
    // }

    const vendors = await Vendor.find(query);
    res.json(vendors);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;