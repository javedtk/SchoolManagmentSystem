const { FeeStructure, FeePayment, Student, Class, User } = require('../models');
const pdfService = require('./pdf.service');
const emailService = require('./email.service');

// Structures CRUD
const getFeeStructures = async () => {
  return FeeStructure.findAll({
    include: [{ model: Class, attributes: ['name', 'section'] }]
  });
};

const createFeeStructure = async (structureData) => {
  return FeeStructure.create(structureData);
};

const updateFeeStructure = async (id, updateData) => {
  const structure = await FeeStructure.findByPk(id);
  if (!structure) {
    throw { status: 404, message: 'Fee structure not found.' };
  }
  return structure.update(updateData);
};

const deleteFeeStructure = async (id) => {
  const structure = await FeeStructure.findByPk(id);
  if (!structure) {
    throw { status: 404, message: 'Fee structure not found.' };
  }
  await structure.destroy();
  return { message: 'Fee structure deleted successfully.' };
};

// Payment Operations
const getStudentFeeStatus = async (studentId) => {
  const student = await Student.findByPk(studentId);
  if (!student) {
    throw { status: 404, message: 'Student not found.' };
  }

  // Get fee structures for student's class, plus global/null class structures
  const { Op } = require('sequelize');
  const structures = await FeeStructure.findAll({
    where: {
      [Op.or]: [
        { class_id: student.class_id },
        { class_id: null }
      ]
    }
  });

  const payments = await FeePayment.findAll({
    where: { student_id: studentId },
    include: [{ model: FeeStructure }]
  });

  // Combine structures with payment status
  const feeStatus = structures.map(structure => {
    const structurePayments = payments.filter(p => p.fee_structure_id === structure.id);
    const verifiedPayments = structurePayments.filter(p => p.verified);
    const amountPaid = verifiedPayments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);
    const balance = parseFloat(structure.amount) - amountPaid;
    const pendingVerification = structurePayments.some(p => !p.verified);
    
    return {
      feeStructure: structure,
      amountPaid,
      balance,
      status: balance <= 0 ? 'paid' : (amountPaid > 0 ? 'partial' : 'unpaid'),
      payments: structurePayments,
      pendingVerification
    };
  });

  return feeStatus;
};

const payFee = async (paymentData) => {
  const student = await Student.findByPk(paymentData.student_id, {
    include: [
      { model: User, attributes: ['name', 'email'] },
      { model: Class }
    ]
  });

  if (!student) {
    throw { status: 404, message: 'Student not found.' };
  }

  const structure = await FeeStructure.findByPk(paymentData.fee_structure_id);
  if (!structure) {
    throw { status: 404, message: 'Fee structure not found.' };
  }

  const receiptNo = `REC${Date.now().toString().slice(-6)}${Math.round(Math.random() * 100)}`;
  const payment = await FeePayment.create({
    student_id: paymentData.student_id,
    fee_structure_id: paymentData.fee_structure_id,
    amount_paid: paymentData.amount_paid,
    payment_mode: paymentData.payment_mode || 'Online',
    receipt_no: receiptNo,
    status: parseFloat(paymentData.amount_paid) >= parseFloat(structure.amount) ? 'paid' : 'partial',
    screenshot_url: paymentData.screenshot_url || null,
    verified: false // Always starts as unverified
  });

  // Send real-time socket notification to admin
  try {
    const socketService = require('./socket.service');
    const io = socketService.getIO();
    if (io) {
      io.emit('new-fee-payment', {
        id: payment.id,
        student_id: student.id,
        student_name: student.User ? student.User.name : 'Student',
        amount_paid: payment.amount_paid,
        category: structure.category,
        payment_mode: payment.payment_mode,
        screenshot_url: payment.screenshot_url,
        payment_date: payment.payment_date
      });
    }
  } catch (err) {
    console.error('Real-time fee payment notification emit failed:', err.message);
  }

  return { payment, message: 'Payment submitted successfully and pending admin verification.' };
};

const getPaymentsList = async () => {
  return FeePayment.findAll({
    include: [
      {
        model: Student,
        include: [
          { model: User, attributes: ['name', 'email'] },
          { model: Class }
        ]
      },
      {
        model: FeeStructure
      }
    ],
    order: [['payment_date', 'DESC']]
  });
};

const getPaymentReceiptPdf = async (paymentId) => {
  const payment = await FeePayment.findByPk(paymentId, {
    include: [{ model: FeeStructure }]
  });
  if (!payment) {
    throw { status: 404, message: 'Payment not found.' };
  }

  if (!payment.verified) {
    throw { status: 403, message: 'Receipt is not available because payment is not verified yet.' };
  }

  const student = await Student.findByPk(payment.student_id, {
    include: [
      { model: User, attributes: ['name', 'email'] },
      { model: Class }
    ]
  });

  const allVerifiedPayments = await FeePayment.findAll({
    where: {
      student_id: payment.student_id,
      fee_structure_id: payment.fee_structure_id,
      verified: true
    }
  });
  const totalPaid = allVerifiedPayments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);
  const remainingDue = Math.max(0, parseFloat(payment.FeeStructure.amount) - totalPaid);

  return pdfService.generateFeeReceiptPDF(student, payment, payment.FeeStructure, remainingDue);
};

const verifyPayment = async (paymentId) => {
  const payment = await FeePayment.findByPk(paymentId, {
    include: [{ model: FeeStructure }]
  });

  if (!payment) {
    throw { status: 404, message: 'Payment record not found.' };
  }

  if (payment.verified) {
    throw { status: 400, message: 'Payment has already been verified.' };
  }

  // Update verified to true
  payment.verified = true;
  await payment.save();

  // Find student info for PDF generation and email
  const student = await Student.findByPk(payment.student_id, {
    include: [
      { model: User, attributes: ['name', 'email'] },
      { model: Class }
    ]
  });

  if (student) {
    try {
      const allVerifiedPayments = await FeePayment.findAll({
        where: {
          student_id: payment.student_id,
          fee_structure_id: payment.fee_structure_id,
          verified: true
        }
      });
      const totalPaid = allVerifiedPayments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);
      const remainingDue = Math.max(0, parseFloat(payment.FeeStructure.amount) - totalPaid);

      // Generate Receipt PDF
      const pdfBuffer = await pdfService.generateFeeReceiptPDF(student, payment, payment.FeeStructure, remainingDue);

      // Email Receipt PDF to Student
      const studentEmail = student.User ? student.User.email : null;
      const studentName = student.User ? student.User.name : 'Student';
      if (studentEmail) {
        await emailService.sendFeeReceiptEmail(studentEmail, studentName, pdfBuffer, payment.receipt_no).catch(err => {
          console.error('Failed to send fee receipt email in background:', err.message);
        });
      }
    } catch (pdfErr) {
      console.error('Error generating PDF or sending email on payment verification:', pdfErr);
    }
  }

  return { payment, message: 'Payment verified successfully and receipt emailed.' };
};

module.exports = {
  getFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getStudentFeeStatus,
  payFee,
  getPaymentsList,
  getPaymentReceiptPdf,
  verifyPayment
};
