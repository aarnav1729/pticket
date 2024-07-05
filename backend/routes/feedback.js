const express = require('express');
const multer = require('multer');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { sendEmail } = require('../emailUtils'); 

const upload = multer({ dest: 'uploads/' }); 

router.post('/', upload.single('attachment'), async (req, res) => {
  const { description, departments, companyCode } = req.body;
  const attachment = req.file ? req.file.filename : null;

  if (!description || !departments || !companyCode) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  let departmentsArray;
  try {
    departmentsArray = JSON.parse(departments);
    if (!Array.isArray(departmentsArray)) {
      throw new Error('Departments should be an array');
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid departments format' });
  }

  const departmentEmails = departmentsArray.map(department => {
    switch (department) {
      case 'procurement':
        return 'aarnavsingh836@gmail.com';
      case 'stores':
        return 'chhabraa@csp.edu';
      default:
        return null;
    }
  }).filter(email => email !== null);

  try {
    const feedback = new Feedback({
      description,
      departments: departmentsArray,
      departmentEmails,
      attachment,
      companyCode
    });
    await feedback.save();
    res.status(201).json(feedback);
    
    await sendEmail(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const { department, status } = req.query;
  try {
    let feedbacks;
    if (department) {
      feedbacks = await Feedback.find({ departments: department });
    } else if (status) {
      feedbacks = await Feedback.find({ status });
    } else {
      feedbacks = await Feedback.find();
    }
    res.json(feedbacks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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

// Route to reopen a feedback
router.put('/:id/reopen', async (req, res) => {
  const { id } = req.params;
  try {
    const feedback = await Feedback.findByIdAndUpdate(id, { status: 'pending', resolvedAt: null }, { new: true });
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    await sendEmail(feedback, 'reopen'); // Send email for reopened ticket
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;