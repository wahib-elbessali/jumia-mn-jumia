const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes')
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");


dotenv.config();

const app = express();

const clientorigin = process.env.CLIENT_ORIGIN;

// Middleware
app.use(
  cors({
    origin: clientorigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
});

// Use auth routes
app.use('/api/auth', authRoutes);
// Use amdmin routes
app.use('/api/admin', adminRoutes);
// Use product routes
app.use('/api/products', productRoutes);
// Use order routes
app.use("/api/orders", orderRoutes);
// Use cart routes
app.use("/api/cart", cartRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});