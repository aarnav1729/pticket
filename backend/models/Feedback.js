const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  description: { type: String, required: true },
  departments: { type: [String], required: true },
  departmentEmails: { type: [String], required: true }, 
  attachment: { type: String },
  companyCode: { type: String, required: true },
  status: { type: String, default: 'pending' },
  resolution: { type: String },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
}, { collection: 'pstickets' });

module.exports = mongoose.model('Feedback', FeedbackSchema);