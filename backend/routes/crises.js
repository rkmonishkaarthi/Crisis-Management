const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Crisis = require('../models/Crisis');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Dummy geocoding function
const geocodeLocation = async (location) => {
  // Replace this with real geocoding later
  return { lat: 0, lng: 0 };
};

// ✅ POST: Add crisis with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const crisisData = {
      title: req.body.title,
      location: req.body.location,
      severity: req.body.severity,
      description: req.body.description,
      approved: false,
    };

    if (req.file) {
      crisisData.image = path.posix.join('uploads', req.file.filename);
    }

    const crisis = new Crisis(crisisData);
    await crisis.save();
    res.status(201).json({ message: 'Crisis reported successfully', crisis });
  } catch (error) {
    console.error('Error saving crisis:', error);
    res.status(500).json({ error: 'Failed to save crisis' });
  }
});

// ✅ GET all crises
router.get('/', async (req, res) => {
  try {
    const crises = await Crisis.find();
    res.json(crises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET pending crises
router.get('/pending', async (req, res) => {
  try {
    const pendingCrises = await Crisis.find({ approved: false });
    res.json(pendingCrises);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending crises' });
  }
});

// ✅ GET approved crises
router.get('/approved', async (req, res) => {
  try {
    const approvedCrises = await Crisis.find({ approved: true });
    res.json(approvedCrises);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch approved crises' });
  }
});

// ✅ PUT: Update approval status + optional geolocation
router.put('/:id/review', async (req, res) => {
  console.log('🔁 PUT /crises/:id/review HIT');
  console.log('Request ID:', req.params.id);
  console.log('Request Body:', req.body);
  try {
    const { status } = req.body;
    const approved = status === 'Approved';
    const update = { approved }

    if (approved) {
      const crisis = await Crisis.findById(req.params.id);
      if (crisis && (!crisis.lat || !crisis.lng)) {
        const coords = await geocodeLocation(crisis.location);
        update.lat = coords.lat;
        update.lng = coords.lng;
      }
    }

    const updated = await Crisis.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Error in PUT /:id/review:', err);
    res.status(500).json({ error: 'Failed to update crisis status' });
  }
});

module.exports = router;
