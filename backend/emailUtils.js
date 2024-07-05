const nodemailer = require('nodemailer');
const Feedback = require('./models/Feedback');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (feedback, context = 'new') => {
  let subject, message;

  if (context === 'reopen') {
    subject = 'Ticket Reopened';
    message = `The following issue has been reopened:\n\n${feedback.description}\n\nPlease address it as soon as possible.`;
  } else {
    subject = 'New Issue Notification';
    message = `A new issue has been raised:\n\n${feedback.description}\n\nPlease address it as soon as possible.`;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: feedback.departmentEmails.join(', '),
    subject,
    text: message,
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