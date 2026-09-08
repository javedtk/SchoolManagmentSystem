const jobApplicationService = require('../services/jobApplication.service');
const path = require('path');
const env = require('../config/env');

const getAllApplications = async (req, res, next) => {
  try {
    const list = await jobApplicationService.getAllApplications();
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const getApplicationsByJob = async (req, res, next) => {
  try {
    const list = await jobApplicationService.getApplicationsByJob(req.params.jobId);
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const applyForJob = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    const applicationData = {
      job_id: req.body.job_id,
      applicant_name: req.body.applicant_name,
      email: req.body.email,
      phone: req.body.phone,
      cover_letter: req.body.cover_letter,
      resume: `uploads/resumes/${req.file.filename}`,
      status: 'applied'
    };

    const application = await jobApplicationService.applyForJob(applicationData);
    return res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await jobApplicationService.updateApplicationStatus(req.params.id, status);
    return res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

const downloadResume = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', env.uploadDir, 'resumes', filename);
    return res.download(filePath);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllApplications,
  getApplicationsByJob,
  applyForJob,
  updateApplicationStatus,
  downloadResume
};
