const express = require('express');
const router = express.Router();
const feeController = require('../controllers/fee.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const upload = require('../middlewares/upload.middleware');

router.use(authMiddleware);

// Fee Structures (Admin CRUD, read by all)
router.get('/structures', feeController.getFeeStructures);
router.post('/structures', roleMiddleware(['super_admin']), feeController.createFeeStructure);
router.put('/structures/:id', roleMiddleware(['super_admin']), feeController.updateFeeStructure);
router.delete('/structures/:id', roleMiddleware(['super_admin']), feeController.deleteFeeStructure);

// Student fee payments and status checking
router.get('/student/status', roleMiddleware(['student']), feeController.getStudentFeeStatus);
router.get('/student/status/:studentId', roleMiddleware(['super_admin', 'teacher']), feeController.getStudentFeeStatus);

// Pay fee with screenshot upload
router.post('/pay', roleMiddleware(['super_admin', 'student']), upload.single('screenshot'), feeController.payFee);

// Verify payment (admin only)
router.put('/payments/:paymentId/verify', roleMiddleware(['super_admin']), feeController.verifyPayment);

// Payments history (admin only)
router.get('/payments', roleMiddleware(['super_admin']), feeController.getPaymentsList);

// PDF Receipts downloads
router.get('/payments/:paymentId/receipt', feeController.downloadReceipt);

module.exports = router;
