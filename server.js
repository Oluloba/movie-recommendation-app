// server.js or index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// MongoDB Connection
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('✅ Movie Recommendation APP is running');
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('📂 Using database:', mongoose.connection.name); // ADDED THIS LINE BECAUSE OF USER LOGIN ISSUES WITH USER LOGIN
  console.log('🏷️ Cluster host:', mongoose.connection.host); // ADDED THIS LINE BECAUSE MONGO IS NOT RETRIVING THE USER
  app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
})

.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
