const feeService = require('../services/fee.service');

// Structures CRUD
const getFeeStructures = async (req, res, next) => {
  try {
    const list = await feeService.getFeeStructures();
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const createFeeStructure = async (req, res, next) => {
  try {
    const struct = await feeService.createFeeStructure(req.body);
    return res.status(201).json(struct);
  } catch (error) {
    next(error);
  }
};

const updateFeeStructure = async (req, res, next) => {
  try {
    const struct = await feeService.updateFeeStructure(req.params.id, req.body);
    return res.status(200).json(struct);
  } catch (error) {
    next(error);
  }
};

const deleteFeeStructure = async (req, res, next) => {
  try {
    const result = await feeService.deleteFeeStructure(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Payment Operations
const getStudentFeeStatus = async (req, res, next) => {
  try {
    let studentId = req.user.profileId;
    if (req.user.role !== 'student' && req.params.studentId) {
      studentId = req.params.studentId;
    }
    
    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required.' });
    }

    const list = await feeService.getStudentFeeStatus(studentId);
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const payFee = async (req, res, next) => {
  try {
    const paymentData = req.body;
    // If student, force their profile id
    if (req.user.role === 'student') {
      paymentData.student_id = req.user.profileId;
    }

    if (req.file) {
      paymentData.screenshot_url = `uploads/images/${req.file.filename}`;
    }

    const result = await feeService.payFee(paymentData);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPaymentsList = async (req, res, next) => {
  try {
    const payments = await feeService.getPaymentsList();
    return res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

const downloadReceipt = async (req, res, next) => {
  try {
    const buffer = await feeService.getPaymentReceiptPdf(req.params.paymentId);
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Receipt-${req.params.paymentId}.pdf`);
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const result = await feeService.verifyPayment(req.params.paymentId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getStudentFeeStatus,
  payFee,
  getPaymentsList,
  downloadReceipt,
  verifyPayment
};
