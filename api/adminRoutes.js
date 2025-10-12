const express = require('express');
const router = express.Router();
const User = require('../backend/models/User');
const Vendor = require('../backend/models/Vendor');
const adminAuth = require('./adminAuth');

router.use(adminAuth);

router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments({ accountType: 'customer' });
    const vendorCount = await Vendor.countDocuments();
    res.json({ totalUsers: userCount, totalVendors: vendorCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ accountType: 'customer' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find({}).populate('owner', 'name email');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/ban', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBanned = !user.isBanned; 
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/vendors/:id/ban', async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        vendor.isBanned = !vendor.isBanned; 
        await vendor.save();
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;