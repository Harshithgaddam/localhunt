// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path'); 
// const cors = require('cors');
// const authRoutes = require('./routes/auth');
// const vendorRoutes = require('./routes/vendors');
// const placesRoutes = require('./routes/places');
// const productRoutes = require('./routes/products');
// const adminRoutes = require('./routes/adminRoutes');
// const app = express();
// const corsOptions = {
//   origin: 'https://localhunt-2.onrender.com'
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/vendors', vendorRoutes);
// app.use('/api/places', placesRoutes);
// app.use('/api/products', productRoutes); 
// app.use('/api/admin', adminRoutes);
// app.use('/api/reviews', require('./routes/reviews'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//  app.use(express.static('../frontend/dist'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
//   });
// // if (process.env.NODE_ENV === 'production') {
// //   // Set static folder
// //   app.use(express.static('frontend/dist')); // Or ../frontend/dist

// //   app.get('*', (req, res) => {
// //     res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
// //   });
// // }


// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.log(err));
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// --- Route Imports ---
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const placesRoutes = require('./routes/places');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviews');

const app = express();
const corsOptions = {
  origin: 'https://localhunt-2.onrender.com'
};
// --- Middleware ---
app.use(cors(corsOptions));
app.use(express.json());

// --- API Routes ---
// API routes MUST be defined BEFORE the static file and fallback routes.
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const frontendDistPath = path.resolve(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// --- Database Connection & Server Start ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

