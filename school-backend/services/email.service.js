const transporter = require('../config/email.config');
const env = require('../config/env');

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${env.db.name === 'schldbdev001' ? 'Aether Academy' : 'School SMS'}" <${env.email.user}>`,
      to,
      subject,
      html,
      attachments
    });
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    // Do not throw so that the API call doesn't fail purely because of SMTP issues in local test
    return null;
  }
};

const sendAdmissionEnquiryAlert = async (enquiry) => {
  const subject = `New Admission Enquiry: ${enquiry.student_name}`;
  const html = `
    <h2>New Admission Enquiry Received</h2>
    <p><strong>Student Name:</strong> ${enquiry.student_name}</p>
    <p><strong>Parent Name:</strong> ${enquiry.parent_name}</p>
    <p><strong>Contact:</strong> ${enquiry.contact}</p>
    <p><strong>Email:</strong> ${enquiry.email}</p>
    <p><strong>Class Applied:</strong> ${enquiry.class_applied}</p>
    <p><strong>Applied Date:</strong> ${new Date(enquiry.applied_date).toLocaleDateString()}</p>
  `;
  // Send to school email config
  return sendEmail({ to: env.email.user, subject, html });
};

const sendFeeReceiptEmail = async (studentEmail, studentName, receiptBuffer, receiptNo) => {
  const subject = `Fee Payment Receipt - ${receiptNo}`;
  const html = `
    <h3>Dear ${studentName},</h3>
    <p>Thank you for your fee payment. Please find attached your official payment receipt (Receipt No: <strong>${receiptNo}</strong>).</p>
    <br/>
    <p>Best Regards,<br/>Accounts Department<br/>Aether Academy</p>
  `;
  const attachments = [
    {
      filename: `Receipt-${receiptNo}.pdf`,
      content: receiptBuffer
    }
  ];
  return sendEmail({ to: studentEmail, subject, html, attachments });
};

const sendResultEmail = async (studentEmail, studentName, resultBuffer, examName) => {
  const subject = `Exam Results Published: ${examName}`;
  const html = `
    <h3>Dear ${studentName},</h3>
    <p>Your results for <strong>${examName}</strong> have been published. Please see the attached report card PDF.</p>
    <br/>
    <p>Best Regards,<br/>Examination Committee<br/>Aether Academy</p>
  `;
  const attachments = [
    {
      filename: `${studentName.replace(/\s+/g, '_')}-${examName.replace(/\s+/g, '_')}-Report-Card.pdf`,
      content: resultBuffer
    }
  ];
  return sendEmail({ to: studentEmail, subject, html, attachments });
};

const sendJobApplicationAlert = async (application, jobTitle, resumeAbsolutePath) => {
  const subject = `New Job Application: ${jobTitle} - ${application.applicant_name}`;
  const html = `
    <h2>New Job Application Received</h2>
    <p><strong>Job Title:</strong> ${jobTitle}</p>
    <p><strong>Applicant Name:</strong> ${application.applicant_name}</p>
    <p><strong>Email:</strong> ${application.email}</p>
    <p><strong>Phone:</strong> ${application.phone}</p>
    <p><strong>Cover Letter:</strong></p>
    <p>${application.cover_letter || 'None provided'}</p>
  `;
  const attachments = [];
  if (resumeAbsolutePath) {
    attachments.push({
      path: resumeAbsolutePath
    });
  }
  return sendEmail({ to: env.email.user, subject, html, attachments });
};

const sendStudentWelcomeEmail = async (studentEmail, studentName, password) => {
  const subject = `Welcome to Aether Academy - Login Credentials`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Aether Academy</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background-color: #f3f4f6;
      padding: 24px 12px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
    }
    .header {
      background-color: #064e3b;
      border-bottom: 4px solid #c5a880;
      padding: 40px 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #ffffff;
      text-transform: uppercase;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 11px;
      color: #c5a880;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 600;
    }
    .content {
      padding: 32px 24px;
    }
    .welcome-text {
      font-size: 15px;
      line-height: 1.7;
      color: #4b5563;
      margin-bottom: 32px;
    }
    .credentials-card {
      background-color: #fcfaf7;
      border: 1px solid #e9dfd3;
      border-left: 4px solid #064e3b;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 36px;
    }
    .credentials-card h3 {
      margin: 0 0 20px 0;
      font-size: 12px;
      color: #064e3b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
    }
    .credential-row {
      margin-bottom: 16px;
    }
    .credential-label {
      font-size: 10px;
      font-weight: 700;
      color: #8a94a6;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
      display: block;
    }
    .credential-value {
      font-size: 14px;
      color: #1f2937;
      font-weight: 600;
      word-break: break-all;
      display: block;
    }
    .credential-value a {
      color: #15803d;
      text-decoration: none;
      font-weight: 600;
      word-break: break-all;
    }
    .btn-wrap {
      margin-top: 24px;
    }
    .btn-login {
      display: inline-block;
      background-color: #064e3b;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      padding: 12px 32px;
      border-radius: 6px;
      text-align: center;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 6px -1px rgba(6, 78, 59, 0.2);
    }
    .facilities-section {
      border-top: 1px solid #f3f4f6;
      padding-top: 32px;
      margin-top: 36px;
    }
    .facilities-section h4 {
      margin: 0 0 24px 0;
      font-size: 12px;
      color: #c5a880;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .facility-item {
      border-left: 3px solid #c5a880;
      padding-left: 16px;
      margin-bottom: 24px;
    }
    .facility-title {
      font-size: 14px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 4px;
    }
    .facility-desc {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.6;
    }
    .footer {
      background-color: #f9fafb;
      border-top: 1px solid #f3f4f6;
      padding: 32px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .footer p {
      margin: 4px 0;
    }
    .footer-divider {
      margin: 12px auto;
      width: 40px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Aether Academy</h1>
        <p>Official Student Enrollment Confirmation</p>
      </div>
      <div class="content">
        <p class="welcome-text">
          Dear <strong>${studentName}</strong>,
          <br/><br/>
          We are pleased to confirm your admission to the academic roll at Aether Academy. Your official student profile has been established and is fully active. You may now log in to the student portal to review class enrollments, timetables, marks, billing ledgers, and events.
        </p>
        
        <div class="credentials-card">
          <h3>Student Access Credentials</h3>
          <div class="credential-row">
            <span class="credential-label">Portal URL</span>
            <span class="credential-value"><a href="http://localhost:3000/auth/login">http://localhost:3000/auth/login</a></span>
          </div>
          <div class="credential-row">
            <span class="credential-label">Username</span>
            <span class="credential-value">${studentEmail}</span>
          </div>
          <div class="credential-row">
            <span class="credential-label">Password</span>
            <span class="credential-value"><strong>${password}</strong></span>
          </div>
          <div class="btn-wrap">
            <a href="http://localhost:3000/auth/login" class="btn-login" style="color: #ffffff;">Access Portal</a>
          </div>
        </div>
        
        <div class="facilities-section">
          <h4>Academy Charter & Featured Facilities</h4>
          
          <div class="facility-item">
            <div class="facility-title">Science & Robotics Laboratories</div>
            <div class="facility-desc">
              State-of-the-art computational facilities equipped with modern microcontrollers, sensory hardware, and data science suites.
            </div>
          </div>
          
          <div class="facility-item">
            <div class="facility-title">Olympic Sports & Aquatics Complex</div>
            <div class="facility-desc">
              Complete physical infrastructure including an indoor arena, tennis courts, synthetic tracks, and a heated pool.
            </div>
          </div>
          
          <div class="facility-item">
            <div class="facility-title">The Atheneum Digital Library</div>
            <div class="facility-desc">
              High-speed terminal networks offering deep repository research, international journals, and a collection of 50,000+ works.
            </div>
          </div>
          
          <div class="facility-item">
            <div class="facility-title">Collaborative Innovation Chambers</div>
            <div class="facility-desc">
              Smart room configurations built to support engineering projects, design workshops, and study groups.
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>Aether Academy | Office of the Registrar</p>
        <p>registrar@aetheracademy.edu | +1 (555) 019-2000</p>
        <div class="footer-divider"></div>
        <p>This is an automated administrative statement. Confidentiality is fully protected.</p>
        <p>25 Academy Boulevard, Springfield</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  return sendEmail({ to: studentEmail, subject, html });
};

const sendJobApplicationConfirmation = async (application, jobTitle) => {
  const subject = `Application Received: ${jobTitle} - Aether Academy`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application Received</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background-color: #f3f4f6;
      padding: 24px 12px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
    }
    .header {
      background-color: #064e3b;
      border-bottom: 4px solid #c5a880;
      padding: 40px 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #ffffff;
      text-transform: uppercase;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 11px;
      color: #c5a880;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 600;
    }
    .content {
      padding: 32px 24px;
    }
    .welcome-text {
      font-size: 15px;
      line-height: 1.7;
      color: #4b5563;
      margin-bottom: 32px;
    }
    .details-card {
      background-color: #fcfaf7;
      border: 1px solid #e9dfd3;
      border-left: 4px solid #064e3b;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 36px;
    }
    .details-card h3 {
      margin: 0 0 20px 0;
      font-size: 12px;
      color: #064e3b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
    }
    .detail-row {
      margin-bottom: 16px;
    }
    .detail-label {
      font-size: 10px;
      font-weight: 700;
      color: #8a94a6;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
      display: block;
    }
    .detail-value {
      font-size: 14px;
      color: #1f2937;
      font-weight: 600;
      display: block;
    }
    .footer {
      background-color: #f9fafb;
      border-top: 1px solid #f3f4f6;
      padding: 32px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .footer p {
      margin: 4px 0;
    }
    .footer-divider {
      margin: 12px auto;
      width: 40px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Aether Academy</h1>
        <p>Application Received Confirmation</p>
      </div>
      <div class="content">
        <p class="welcome-text">
          Dear <strong>${application.applicant_name}</strong>,
          <br/><br/>
          Thank you for applying for the position of <strong>${jobTitle}</strong> at Aether Academy. We have successfully received your application, and our recruitment team is currently reviewing your qualifications and experience.
          <br/><br/>
          If your profile matches our requirements, we will contact you directly to schedule an interview. We appreciate your interest in joining our academic team!
        </p>
        
        <div class="details-card">
          <h3>Your Application Summary</h3>
          <div class="detail-row">
            <span class="detail-label">Target Position</span>
            <span class="detail-value">${jobTitle}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Applicant Name</span>
            <span class="detail-value">${application.applicant_name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Contact Email</span>
            <span class="detail-value">${application.email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Contact Phone</span>
            <span class="detail-value">${application.phone}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>Aether Academy | Human Resources Department</p>
        <p>careers@aetheracademy.edu | +1 (555) 019-2000</p>
        <div class="footer-divider"></div>
        <p>This is an automated recruitment notification. Confidentiality is fully protected.</p>
        <p>25 Academy Boulevard, Springfield</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  return sendEmail({ to: application.email, subject, html });
};

const sendJobApplicationStatusUpdate = async (application, jobTitle, status) => {
  let statusText = '';
  let statusColor = '#064e3b';
  let messageBody = '';
  let subject = '';

  if (status === 'shortlisted') {
    statusText = 'Shortlisted';
    statusColor = '#d97706'; // Gold/orange
    subject = `Application Update: Shortlisted for ${jobTitle} - Aether Academy`;
    messageBody = `
      We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> has been **shortlisted**!
      <br/><br/>
      Our recruitment committee was impressed by your credentials and would like to proceed with the next steps of our selection process. A member of our Human Resources team will contact you shortly to schedule an interview (either virtual or in-person). Please keep an eye on your inbox and phone.
    `;
  } else if (status === 'rejected') {
    statusText = 'Application Status Update';
    statusColor = '#dc2626'; // Red
    subject = `Application Update: ${jobTitle} - Aether Academy`;
    messageBody = `
      Thank you for your interest in the <strong>${jobTitle}</strong> position at Aether Academy, and for taking the time to submit your application.
      <br/><br/>
      After careful review of all applications, we regret to inform you that we will not be moving forward with your application at this time. We received a high volume of qualified applications, and had to make some very difficult decisions.
      <br/><br/>
      We appreciate your interest in our academy and wish you the very best in your future career endeavors.
    `;
  } else if (status === 'hired') {
    statusText = 'Selected / Offered';
    statusColor = '#15803d'; // Green
    subject = `Congratulations! Selected for ${jobTitle} - Aether Academy`;
    messageBody = `
      We are absolutely thrilled to inform you that you have been **selected** for the position of <strong>${jobTitle}</strong> at Aether Academy! Congratulations!
      <br/><br/>
      Our selection committee was exceptionally impressed by your interview performance, pedagogical vision, and professional background. We believe you will make a wonderful addition to our academic community.
      <br/><br/>
      Our Human Resources manager will contact you in the next 24-48 hours with a formal offer letter and details regarding the onboarding and documentation process. Welcome to Aether Academy!
    `;
  } else {
    // Fallback status
    statusText = status.charAt(0).toUpperCase() + status.slice(1);
    subject = `Application Status Update: ${jobTitle} - Aether Academy`;
    messageBody = `
      The status of your application for the position of <strong>${jobTitle}</strong> has been updated to: <strong>${statusText}</strong>.
    `;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application Status Update</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background-color: #f3f4f6;
      padding: 24px 12px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
    }
    .header {
      background-color: #064e3b;
      border-bottom: 4px solid #c5a880;
      padding: 40px 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #ffffff;
      text-transform: uppercase;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 11px;
      color: #c5a880;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 600;
    }
    .content {
      padding: 32px 24px;
    }
    .welcome-text {
      font-size: 15px;
      line-height: 1.7;
      color: #4b5563;
      margin-bottom: 32px;
    }
    .status-badge-container {
      text-align: center;
      margin: 24px 0 32px 0;
    }
    .status-badge {
      display: inline-block;
      background-color: ${statusColor};
      color: #ffffff !important;
      font-size: 12px;
      font-weight: 700;
      padding: 8px 24px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .footer {
      background-color: #f9fafb;
      border-top: 1px solid #f3f4f6;
      padding: 32px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .footer p {
      margin: 4px 0;
    }
    .footer-divider {
      margin: 12px auto;
      width: 40px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Aether Academy</h1>
        <p>Official Recruitment Update</p>
      </div>
      <div class="content">
        <p class="welcome-text">
          Dear <strong>${application.applicant_name}</strong>,
          <br/><br/>
          ${messageBody}
        </p>

        <div class="status-badge-container">
          <span class="status-badge">${statusText}</span>
        </div>
      </div>
      <div class="footer">
        <p>Aether Academy | Human Resources Department</p>
        <p>careers@aetheracademy.edu | +1 (555) 019-2000</p>
        <div class="footer-divider"></div>
        <p>This is an automated recruitment notification. Confidentiality is fully protected.</p>
        <p>25 Academy Boulevard, Springfield</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  return sendEmail({ to: application.email, subject, html });
};

module.exports = {
  sendEmail,
  sendAdmissionEnquiryAlert,
  sendFeeReceiptEmail,
  sendResultEmail,
  sendJobApplicationAlert,
  sendStudentWelcomeEmail,
  sendJobApplicationConfirmation,
  sendJobApplicationStatusUpdate
};
