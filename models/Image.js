// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  originalname: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Image || mongoose.model('Image', imageSchema);
