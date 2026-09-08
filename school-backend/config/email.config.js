const nodemailer = require('nodemailer');
const env = require('./env');

const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  secure: env.email.secure, // false for 587
  auth: {
    user: env.email.user,
    pass: env.email.password
  },
  tls: {
    rejectUnauthorized: false // avoids SSL certificate issues
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP configuration error:', error.message);
  } else {
    console.log('SMTP server is ready to take messages');
  }
});

module.exports = transporter;
