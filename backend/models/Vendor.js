const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  // The user who owns this vendor profile
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  businessName: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  // GeoJSON for location-based queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  contactInfo: {
    phone: String,
    email: String,
  },
  businessHours: { type: Object }, // e.g., { monday: "9am-5pm", ... }
  // productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// Create a geospatial index for the location field
vendorSchema.index({ location: '2dsphere' });

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;