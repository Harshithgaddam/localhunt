// // const express = require('express');
// // const router = express.Router();
// // const Vendor = require('../models/Vendor');

// // // @route   GET /api/vendors
// // // @desc    Search for vendors based on location and other filters
// // const { Client } = require('@googlemaps/google-maps-services-js');
// // const client = new Client({});
// // router.get('/', async (req, res) => {
// //   const { location, q } = req.query; // 'location' is the text, 'q' is the optional name search

// //   if (!location) {
// //     return res.status(400).json({ message: 'Location parameter is required' });
// //   }

// //   try {
// //     // 1. Geocode the text location to get coordinates
// //     const geocodeResponse = await client.geocode({
// //       params: {
// //         address: location,
// //         key: process.env.GOOGLE_MAPS_API_KEY,
// //       },
// //     });

// //     if (geocodeResponse.data.results.length === 0) {
// //       return res.json([]); // Return empty array if location not found
// //     }

// //     const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

// //     // 2. Build the MongoDB query
// //     const maxDistance = 20000; // Search within 20km
// //     let query = {
// //       location: {
// //         $near: {
// //           $geometry: {
// //             type: 'Point',
// //             coordinates: [lng, lat], // [longitude, latitude]
// //           },
// //           $maxDistance: maxDistance,
// //         },
// //       },
// //     };

// //     // 3. Add optional search query for business name
// //     if (q) {
// //       query.businessName = { $regex: q, $options: 'i' };
// //     }

// //     // 4. Find vendors in our database matching the query
// //     const vendors = await Vendor.find(query);
// //     res.json(vendors);

// //   } catch (error) {
// //     console.error('Vendor search error:', error);
// //     res.status(500).json({ message: 'Server Error' });
// //   }
// // });
// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const Vendor = require('../models/Vendor');
// const { Client } = require('@googlemaps/google-maps-services-js');
// const client = new Client({});

// // @route   GET /api/vendors
// // @desc    Unified search for vendors from our DB and Google Places
// router.get('/', async (req, res) => {
//   const { keyword, lat, lng, location } = req.query;

//   if (!keyword) {
//     return res.status(400).json({ message: 'A search keyword is required' });
//   }

//   try {
//     let searchLocation;

//     // 1. Determine the coordinates to search from
//     if (lat && lng) {
//       searchLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
//     } else if (location) {
//       const geocodeResponse = await client.geocode({
//         params: { address: location, key: process.env.GOOGLE_MAPS_API_KEY },
//       });
//       if (geocodeResponse.data.results.length === 0) {
//         return res.status(400).json({ message: 'Location not found' });
//       }
//       searchLocation = geocodeResponse.data.results[0].geometry.location;
//     } else {
//       return res.status(400).json({ message: 'Location data is required' });
//     }

//     // 2. Run both searches in parallel for efficiency
//     const [dbVendors, googlePlaces] = await Promise.all([
//       // Search 1: Find vendors in our own MongoDB database
//       Vendor.find({
//         businessName: { $regex: keyword, $options: 'i' },
//         location: {
//           $near: {
//             $geometry: { type: 'Point', coordinates: [searchLocation.lng, searchLocation.lat] },
//             $maxDistance: 20000, // 20km
//           },
//         },
//       }),

//       // Search 2: Find places from the Google Places API
//       client.placesNearby({
//         params: {
//           location: searchLocation,
//           radius: 5000, // 5km
//           keyword,
//           key: process.env.GOOGLE_MAPS_API_KEY,
//         },
//       })
//     ]);
    
//     // 3. Send both sets of results back to the frontend
//     res.json({
//       registeredVendors: dbVendors,
//       discoveredPlaces: googlePlaces.data.results,
//     });

//   } catch (error) {
//     console.error('Unified Search Error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const getCoordinates = require("../utils/geocode");
const { fetchOSMShops } = require('../utils/osm'); // We are using your OSM utility function

// This handles GET requests to /api/vendors
// router.get('/', async (req, res) => {
//   const { lat, lon } = req.query;

//   if (!lat || !lon) {
//     return res.status(400).json({ msg: 'Latitude and longitude are required' });
//   }

//   try {
//     // Call the function that gets data from OpenStreetMap
//     const shops = await fetchOSMShops(lat, lon);
//     res.json(shops);
//   } catch (error) {
//     console.error('Error fetching from Overpass API:', error);
//     res.status(500).send('Server error while fetching vendors');
//   }
// });

// module.exports = router;
router.get("/", async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ message: "Location query parameter is required" });
  }

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
          $maxDistance: 10000 // Distance in meters (10km)
        }
      }
    });

    res.json(vendors);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching nearby vendors.' });
  }
});
// router.get('/', async (req, res) => {
//   const { q, location } = req.query;
//    console.log("HIT / with query:", req.query);
//   try { 
//     let query = {};
//     if (location) {
//       query.address = { $regex: location, $options: 'i' };
//     }
//     if (q) {
//       query.businessName = { $regex: q, $options: 'i' };
//     }
//     const vendors = await Vendor.find(query).populate('owner', 'name');
//         const vendorsWithRating = vendors.map(v => ({
//       ...v.toObject(),
//       rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1) // Random rating between 3.5 and 5.0
//     }));
//     res.json(vendorsWithRating);
//   } catch (error) {
//     console.error('Vendor search error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });
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