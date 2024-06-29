// backend/models/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  description: { type: String, required: true },
  departments: { type: [String], required: true },
  attachment: { type: String },
  companyCode: { type: String, required: true },
  status: { type: String, default: 'pending' },
  resolution: { type: String }, // Ensure this field is included
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);