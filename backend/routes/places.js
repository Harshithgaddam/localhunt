const express = require('express');
const router = express.Router();
const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

// @route   GET /api/places/nearby
// @desc    Search for nearby places using coordinates OR a text location
router.get('/nearby', async (req, res) => {
  const { keyword, lat, lng, location } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: 'Missing required query parameter: keyword' });
  }

  try {
    let searchLocation;

    if (lat && lng) {
      searchLocation = { lat, lng };
    } else if (location) {
      const geocodeResponse = await client.geocode({
        params: {
          address: location,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });
      if (geocodeResponse.data.results.length === 0) {
        return res.status(400).json({ message: 'Could not find coordinates for the specified location.' });
      }
      searchLocation = geocodeResponse.data.results[0].geometry.location;
    } else {
      return res.status(400).json({ message: 'You must provide either coordinates or a text location.' });
    }

    const response = await client.placesNearby({
      params: {
        location: searchLocation,
        radius: 5000, // 5km radius
        keyword: keyword,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    
    const places = response.data.results.map(place => ({
      place_id: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 0,
      user_ratings_total: place.user_ratings_total || 0,
    }));
    res.json(places);

  } catch (error) {
    console.error('Google Places API Error:', error.response?.data?.error_message || error.message);
    res.status(500).json({ message: 'Failed to fetch data from Google Places API' });
  }
});


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
        types: 'establishment',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    res.json(response.data.predictions);
  } catch (error) {
    console.error('Autocomplete Error:', error);
    res.status(500).json({ message: 'Failed to fetch autocomplete suggestions' });
  }
});


// @route   GET /api/places/details/:place_id
// @desc    Get details for a specific place from Google
router.get('/details/:place_id', async (req, res) => {
  const { place_id } = req.params;

  try {
    const response = await client.placeDetails({
      params: {
        place_id: place_id,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'geometry'],
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    res.json(response.data.result);
  } catch (error) {
    console.error('Place Details Error:', error);
    res.status(500).json({ message: 'Failed to fetch place details' });
  }
});
module.exports = router;