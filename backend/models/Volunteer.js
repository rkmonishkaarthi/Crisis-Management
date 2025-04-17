const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  availability: String,
  crisisName: String, // 💥 Add this line
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
