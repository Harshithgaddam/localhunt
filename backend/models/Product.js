const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor', 
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  images: [{ type: String }], 
  isAvailable: { type: Boolean, default: true },
  stock: { type: Number, default: 1 },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true }); 
const Product = mongoose.model('Product', productSchema);
module.exports = Product;