const mongoose = require('mongoose');
const vendorSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },  
  businessName: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required:true,
    },
    coordinates: {
      type: [Number],
      required:true
    }, 
  },
  contactInfo: {
    phone: String,
    email: String,
  },
 businessHours: { type: String }, 
  rating: {
    type: Number,
    default: 0, 
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  // category:{
  //   type:String,
  // }

}, 
{ timestamps: true });
vendorSchema.index({ location: '2dsphere' });
const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;