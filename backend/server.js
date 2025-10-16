require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const placesRoutes = require('./routes/places');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/adminRoutes');
const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/admin', adminRoutes);
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});


mongoose
  .connect('mongodb://127.0.0.1:27017/localhunt')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const axios = require('axios');
// const authRoutes = require('./routes/auth');
// const vendorRoutes = require('./routes/vendors');
// const productRoutes = require('./routes/products');
// const reviewRoutes = require('./routes/reviews');
  
// const app = express();
// app.use(express.json());
// app.use('/uploads', express.static('uploads'));
// app.use('/api/auth', authRoutes);
// app.use('/api/vendors', vendorRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/reviews', reviewRoutes); 
// app.use(express.static(path.join(__dirname, '../frontend/dist')));
// app.get("/api/businesses", async (req, res) => {
//   const { lat, lon } = req.query;
//   if (!lat || !lon) return res.status(400).json({ error: "Latitude and longitude are required" });

//   try {
//     const response = await axios.get("https://api.foursquare.com/v3/places/nearby", {
//       headers: {
//         Accept: "application/json",
//         Authorization: process.env.FOURSQUARE_API_KEY, // use the new Service API key
//       },
//       params: {
//         ll: `${lat},${lon}`,
//         radius: 500,
//         limit: 50,
//       },
//     });

//     // Map the new API response
//     const businesses = response.data.results.map(b => ({
//       id: b.fsq_id,
//       name: b.name,
//       lat: b.geocodes.main.latitude,
//       lon: b.geocodes.main.longitude,
//       address: b.location.formatted_address || "No address",
//       category: b.categories?.[0]?.name || "Unknown",
//     }));

//     res.json(businesses);

//   }  catch (error) {
//   console.error("Foursquare API Error:", error.response?.data || error.message);
//   return res.status(500).json({
//     error: "Failed to fetch businesses from Foursquare",
//     details: error.response?.data || error.message,
//   });
// }
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
// });

// mongoose.connect('mongodb://127.0.0.1:27017/localhunt')
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.log(err));
// const PORT = 5000;  
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));