const express = require('express');
const router = express.Router();
const { Client } = require('@googlemaps/google-maps-services-js');

// Initialize the Google Maps Client
const client = new Client({});

// @route   GET /api/places/nearby
// @desc    Search for nearby places using Google Places API
router.get('/nearby', async (req, res) => {
  const { keyword, lat, lng } = req.query;

  if (!keyword || !lat || !lng) {
    return res.status(400).json({ message: 'Missing required query parameters: keyword, lat, lng' });
  }

  try {
    const response = await client.placesNearby({
      params: {
        location: { lat, lng },
        radius: 5000, // Search within a 5km radius
        keyword: keyword,
        key: process.env.GOOGLE_MAPS_API_KEY, // Your secret API key
      },
      timeout: 1000, // Optional timeout
    });
    // ✅ ADD THIS NEW ROUTE for Autocomplete
// @route   GET /api/places/autocomplete
// @desc    Get place predictions from Google
router.get('/autocomplete', async (req, res) => {
  const { input } = req.query;
  if (!input) {
    return res.status(400).json({ message: 'Input query parameter is required' });
  }

  try {
    const response = await client.placeAutocomplete({
      params: {
        input: input,
        types: 'establishment', // To search for businesses
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    res.json(response.data.predictions);
  } catch (error) {
    console.error('Autocomplete Error:', error);
    res.status(500).json({ message: 'Failed to fetch autocomplete suggestions' });
  }
});


// ✅ ADD THIS NEW ROUTE for Place Details
// @route   GET /api/places/details/:place_id
// @desc    Get details for a specific place from Google
router.get('/details/:place_id', async (req, res) => {
  const { place_id } = req.params;

  try {
    const response = await client.placeDetails({
      params: {
        place_id: place_id,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'geometry'], // Specify which fields you want
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    res.json(response.data.result);
  } catch (error) {
    console.error('Place Details Error:', error);
    res.status(500).json({ message: 'Failed to fetch place details' });
  }
});

    // We only need a subset of the data from Google's response
    const places = response.data.results.map(place => ({
      place_id: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 0,
      user_ratings_total: place.user_ratings_total || 0,
      photos: place.photos,
      location: place.geometry.location,
    }));

    res.json(places);

  } catch (error) {
    console.error('Google Places API Error:', error.response?.data?.error_message || error.message);
    res.status(500).json({ message: 'Failed to fetch data from Google Places API' });
  }
});

module.exports = router;