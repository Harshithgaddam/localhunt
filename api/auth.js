const express = require('express');
const router = express.Router();
const User = require('../backend/models/User');
const Vendor = require('../backend/models/Vendor');
const jwt = require('jsonwebtoken');
const getCoordinates = require("../backend/utils/geocode");


const createToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, accountType: user.accountType },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};
router.post('/register', async (req, res) => {
  // 1. Get the new fields from the request body
  const { name, email, password, accountType, businessName, address, phone, businessHours } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const coords = await getCoordinates(address);
    console.log(coords);
    if (!coords) {
      return res.status(400).json({ message: "Invalid address. Could not fetch coordinates." });
    }
    const user = await User.create({ name, email, password, accountType });

    if (user && accountType === 'vendor') {
      // 2. Pass the new data when creating the Vendor document
      await Vendor.create({
        owner: user._id,
        businessName,
        address,
        location: {
        type: "Point",
        coordinates: [coords.lon, coords.lat] 
      },
        contactInfo: { phone: phone }, // Nest the phone number
        businessHours: businessHours,
        // category,
      });

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