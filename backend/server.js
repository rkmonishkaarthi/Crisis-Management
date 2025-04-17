const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ✅ Important!

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve static images from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/disasterDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
const volunteerRoutes = require('./routes/volunteers');
const crisisRoutes = require('./routes/crises');

app.use('/api/volunteers', volunteerRoutes);
app.use('/api/crises', crisisRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
