const nodemailer = require('nodemailer');
const Feedback = require('./models/Feedback');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (feedback) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: feedback.departmentEmails.join(', '),
    subject: 'Issue Notification',
    text: `The following issue is still unresolved:\n\n${feedback.description}\n\nPlease address it as soon as possible.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent:', feedback._id);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendWeeklyEmails = async () => {
  const unresolvedFeedbacks = await Feedback.find({ status: 'pending' });
  for (const feedback of unresolvedFeedbacks) {
    await sendEmail(feedback);
  }
};

module.exports = {
  sendEmail,
  sendWeeklyEmails,
};