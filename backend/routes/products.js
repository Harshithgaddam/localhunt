const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

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

router.get('/', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user.id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found for this user' });
    }
    const products = await Product.find({ vendorId: vendor._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ owner: req.user.id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    const { name, description, price, category, stock, isAvailable } = req.body;
    const imagePath = req.file ? `/${req.file.path.replace(/\\/g, '/')}` : '';
    
    const newProductData = {
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      isAvailable: isAvailable === 'true',
      images: [imagePath],
      vendorId: vendor._id,
    };

    console.log('--- Data Object Before Save ---', newProductData);

    const newProduct = new Product(newProductData);
    const savedProduct = await newProduct.save();

    // ✅ THIS IS THE FINAL PROOF: Let's see what the database returned
    console.log('--- Document Returned from DB After Save ---', savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("!!! ERROR DURING PRODUCT SAVE:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  // ... delete logic
});

module.exports = router;