const { Job } = require('../models');

const getAllJobs = async (where = {}) => {
  return Job.findAll({
    where,
    order: [['posted_date', 'DESC']]
  });
};

const getJobById = async (id) => {
  const job = await Job.findByPk(id);
  if (!job) {
    throw { status: 404, message: 'Job vacancy not found.' };
  }
  return job;
};

const createJob = async (jobData) => {
  return Job.create(jobData);
};

const updateJob = async (id, updateData) => {
  const job = await Job.findByPk(id);
  if (!job) {
    throw { status: 404, message: 'Job vacancy not found.' };
  }
  return job.update(updateData);
};

const deleteJob = async (id) => {
  const job = await Job.findByPk(id);
  if (!job) {
    throw { status: 404, message: 'Job vacancy not found.' };
  }
  await job.destroy();
  return { message: 'Job vacancy deleted successfully.' };
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};
