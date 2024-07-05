const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const feedbackRoutes = require('./routes/feedback');
const cron = require('node-cron');
const { sendWeeklyEmails } = require('./emailUtils');

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'https://psticket.netlify.app', // Update this to your front-end URL
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Routes
app.use('/api/feedback', feedbackRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Schedule the task to run at 9 AM every Monday
cron.schedule('0 9 * * 1', async () => {
  console.log('Running weekly email task...');
  await sendWeeklyEmails();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});