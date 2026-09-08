const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admission.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);
router.use(roleMiddleware(['super_admin']));

// Super Admin Corner
router.get('/enquiries', admissionController.getAllEnquiries);
router.put('/enquiries/:id', admissionController.updateEnquiryStatus);
router.post('/enquiries/:id/convert', admissionController.convertEnquiryToStudent);

module.exports = router;
