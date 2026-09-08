const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplication.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);
router.use(roleMiddleware(['super_admin']));

router.get('/', jobApplicationController.getAllApplications);
router.get('/job/:jobId', jobApplicationController.getApplicationsByJob);
router.put('/:id/status', jobApplicationController.updateApplicationStatus);
router.get('/resumes/:filename', jobApplicationController.downloadResume);

module.exports = router;
