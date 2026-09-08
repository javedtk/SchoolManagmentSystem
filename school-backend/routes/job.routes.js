const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', roleMiddleware(['super_admin']), jobController.createJob);
router.put('/:id', roleMiddleware(['super_admin']), jobController.updateJob);
router.delete('/:id', roleMiddleware(['super_admin']), jobController.deleteJob);

module.exports = router;
