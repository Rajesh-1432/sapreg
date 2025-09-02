const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// SAP Key Schema
const sapKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SapKey = mongoose.model('SapKey', sapKeySchema);

// Endpoint to retrieve SAP key
app.get('/api/sapkey', async (req, res) => {
  try {
    const sapKey = await SapKey.findOne();
    if (!sapKey) {
      return res.status(404).json({ message: 'SAP key not found' });
    }
    res.json({ sapKey: sapKey.key });
  } catch (error) {
    console.error('Error retrieving SAP key:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});