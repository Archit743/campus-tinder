const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', authRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});