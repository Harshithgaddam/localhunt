const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor', // Creates a link to the Vendor model
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }], // An array of image URLs
  isAvailable: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Product = mongoose.model('Product', productSchema);
module.exports = Product;