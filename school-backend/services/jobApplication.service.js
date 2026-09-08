const { JobApplication, Job } = require('../models');
const emailService = require('./email.service');
const path = require('path');
const env = require('../config/env');
const socketService = require('./socket.service');

const getAllApplications = async () => {
  return JobApplication.findAll({
    include: [{ model: Job, attributes: ['title'] }],
    order: [['applied_date', 'DESC']]
  });
};

const getApplicationsByJob = async (jobId) => {
  return JobApplication.findAll({
    where: { job_id: jobId },
    order: [['applied_date', 'DESC']]
  });
};

const applyForJob = async (applicationData) => {
  const application = await JobApplication.create(applicationData);
  
  // Find job title for the email
  const job = await Job.findByPk(application.job_id);
  const jobTitle = job ? job.title : 'General Vacancy';

  // Send email to recruitment team with resume attachment
  const resumeAbsolutePath = application.resume
    ? path.join(__dirname, '..', env.uploadDir, 'resumes', path.basename(application.resume))
    : null;

  await emailService.sendJobApplicationAlert(application, jobTitle, resumeAbsolutePath);

  // Send confirmation email to applicant
  emailService.sendJobApplicationConfirmation(application, jobTitle).catch(err => {
    console.error('Failed to send job application confirmation email:', err.message);
  });

  // Send real-time socket notification to admin
  try {
    const io = socketService.getIO();
    if (io) {
      io.emit('new-job-application', {
        id: application.id,
        job_id: application.job_id,
        applicant_name: application.applicant_name,
        email: application.email,
        phone: application.phone,
        cover_letter: application.cover_letter,
        resume: application.resume,
        status: application.status,
        job_title: jobTitle
      });
    }
  } catch (err) {
    console.error('Real-time notification emit failed:', err);
  }

  return application;
};

const updateApplicationStatus = async (id, status) => {
  const app = await JobApplication.findByPk(id, {
    include: [{ model: Job, attributes: ['title'] }]
  });
  if (!app) {
    throw { status: 404, message: 'Job application not found.' };
  }
  const updatedApp = await app.update({ status });

  const jobTitle = app.Job ? app.Job.title : 'General Vacancy';

  // Send status update email to applicant
  emailService.sendJobApplicationStatusUpdate(updatedApp, jobTitle, status).catch(err => {
    console.error('Failed to send job application status update email:', err.message);
  });

  return updatedApp;
};

module.exports = {
  getAllApplications,
  getApplicationsByJob,
  applyForJob,
  updateApplicationStatus
};
