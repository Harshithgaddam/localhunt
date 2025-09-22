// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path'); 

// const authRoutes = require('./routes/auth');
// const vendorRoutes = require('./routes/vendors');
// const placesRoutes = require('./routes/places');
// const productRoutes = require('./routes/products');
// const app = express();

// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/vendors', vendorRoutes);
// app.use('/api/places', placesRoutes);
// app.use('/api/products', productRoutes); 
// app.use(express.static(path.join(__dirname, '../frontend/dist')));


// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
// });


// mongoose
//   .connect('mongodb://127.0.0.1:27017/localhunt')
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.log(err));
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');
  
const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes); 
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

mongoose.connect('mongodb://127.0.0.1:27017/localhunt')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));
const PORT = 5000;  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));