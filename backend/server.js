require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const cors = require('cors');
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const placesRoutes = require('./routes/places');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const corsOptions = {
  origin: 'https://localhunt-2.onrender.com'
};


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/dist')); // Or ../frontend/dist

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));