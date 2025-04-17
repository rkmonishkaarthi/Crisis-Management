// models/Crisis.js
const mongoose = require('mongoose');

const CrisisSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  severity: String,
  approved: { type: Boolean, default: false },
  lat: Number,
  lng: Number,
  image: String
});

module.exports = mongoose.model('Crisis', CrisisSchema);
