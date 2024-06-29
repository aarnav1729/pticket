// backend/routes/feedback.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Feedback = require('../models/Feedback');

const upload = multer({ dest: 'uploads/' }); // Specify the directory for storing uploaded files

// Route to create a new feedback
router.post('/', upload.single('attachment'), async (req, res) => {
  const { description, departments, companyCode } = req.body;
  const attachment = req.file ? req.file.filename : null;

  if (!description || !departments || !companyCode) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  try {
    const feedback = new Feedback({
      description,
      departments: JSON.parse(departments),
      attachment,
      companyCode
    });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get feedbacks, optionally filtering by department
router.get('/', async (req, res) => {
  const { department } = req.query;
  try {
    let feedbacks;
    if (department) {
      feedbacks = await Feedback.find({ departments: department });
    } else {
      feedbacks = await Feedback.find();
    }
    res.json(feedbacks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to update feedback status and resolution
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, resolution } = req.body;
  try {
    const updateFields = { status, resolution };
    if (status === 'resolved') {
      updateFields.resolvedAt = new Date();
    }
    const feedback = await Feedback.findByIdAndUpdate(id, updateFields, { new: true });
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;