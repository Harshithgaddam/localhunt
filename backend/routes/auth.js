const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

const createToken = (user) => {
 return jwt.sign(
    { id: user._id, name: user.name, accountType: user.accountType },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

router.post('/register', async (req, res) => {
  const { name, email, password, accountType, businessName, address } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({ name, email, password, accountType });

    if (user && accountType === 'vendor') {
      let location = null;
      if (address) {
        const geocodeResponse = await client.geocode({
          params: { address, key: process.env.GOOGLE_MAPS_API_KEY },
        });
        if (geocodeResponse.data.results.length > 0) {
          const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
          location = { type: 'Point', coordinates: [lng, lat] };
        }
      }
      await Vendor.create({ owner: user._id, businessName, address, location });
    }

    res.status(201).json({ token: createToken(user) });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: createToken(user),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;