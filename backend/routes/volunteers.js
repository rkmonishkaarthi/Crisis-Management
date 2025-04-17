const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// POST - Create volunteer request
router.post('/', async (req, res) => {
  try {
    const newVolunteer = new Volunteer(req.body);
    await newVolunteer.save();
    res.status(201).json(newVolunteer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - All volunteer requests
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update volunteer status
router.put('/:id', async (req, res) => {
  try {
    const updated = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update only volunteer status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
