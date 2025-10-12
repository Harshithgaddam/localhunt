const express = require('express');
const router = express.Router();
const Vendor = require('../backend/models/Vendor');
const Product = require('../backend/models/Product');
const getCoordinates = require("../backend/utils/geocode");
const { fetchOSMShops } = require('../backend/utils/osm'); // We are using your OSM utility function

router.get("/", async (req, res) => {
  const { location } = req.query;
console.log(location);
  if (!location) {
    return res.status(400).json({ message: "Location query parameter is required" });
  }
console.log("After if");
  try {
    const coords = await getCoordinates(location);
    if (!coords) {
      return res.status(400).json({ message: "Invalid location. Could not fetch coordinates." });
    }
    const vendors = await Vendor.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [coords.lon, coords.lat] },
          $maxDistance: 5000 
        }
      }
    }).populate("owner", "name");
    res.json(vendors);
  } catch (error) {
    console.error("Vendor search error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // Check if latitude and longitude are provided
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    // Find vendors within a 10 kilometer (10000 meters) radius
    const vendors = await Vendor.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude] // [longitude, latitude]
          },
          $maxDistance: 1000 // Distance in meters (1km)
        }
      }
    });

    res.json(vendors);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching nearby vendors.' });
  }
});

router.get('/:id', async (req, res) => {
    console.log("HIT /:id with param:", req.params.id);
  try {
    const vendor = await Vendor.findById(req.params.id);
    console.log("in /:id")
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    const products = await Product.find({ vendorId: req.params.id });
    res.json({ vendor, products });

  } catch (error) {
    console.error('Error fetching vendor details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { businessName, address,location, owner, contactInfo } = req.body;
    const coords = await getCoordinates(location);
    if (!coords) {
      return res.status(400).json({ message: "Invalid address. Could not fetch coordinates." });
    }
    const vendor = new Vendor({
      businessName,
      address,
      owner,
      contactInfo,
      location: {
        type: "Point",
        coordinates: [coords.lon, coords.lat] 
      }
    });

    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;