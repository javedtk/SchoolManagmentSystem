const { Op } = require('sequelize');
const { Admission, Student, Class } = require('../models');
const studentService = require('./student.service');
const emailService = require('./email.service');
const socketService = require('./socket.service');

const getAllEnquiries = async () => {
  return Admission.findAll({
    where: {
      status: {
        [Op.ne]: 'approved'
      }
    },
    order: [['applied_date', 'DESC']]
  });
};

const submitEnquiry = async (enquiryData) => {
  const enquiry = await Admission.create(enquiryData);
  // Send email notification to school in background (do not await to prevent blocking socket notifications)
  emailService.sendAdmissionEnquiryAlert(enquiry).catch(err => {
    console.error('Background email notification failed:', err.message);
  });

  // Send real-time socket notification to admin
  try {
    const io = socketService.getIO();
    if (io) {
      io.emit('new-admission-enquiry', {
        id: enquiry.id,
        student_name: enquiry.student_name,
        parent_name: enquiry.parent_name,
        contact: enquiry.contact,
        email: enquiry.email,
        class_applied: enquiry.class_applied,
        applied_date: enquiry.applied_date,
        transport_mode: enquiry.transport_mode,
        student_photo: enquiry.student_photo
      });
    }
  } catch (err) {
    console.error('Real-time notification emit failed:', err);
  }

  return enquiry;
};

const updateEnquiryStatus = async (id, status) => {
  const enquiry = await Admission.findByPk(id);
  if (!enquiry) {
    throw { status: 404, message: 'Enquiry not found.' };
  }
  return enquiry.update({ status });
};

const convertEnquiryToStudent = async (id, classId, section) => {
  const enquiry = await Admission.findByPk(id);
  if (!enquiry) {
    throw { status: 404, message: 'Enquiry not found.' };
  }

  if (enquiry.status === 'approved' && enquiry.student_id) {
    throw { status: 400, message: 'Enquiry has already been converted to a student.' };
  }

  // Create student credentials and profile
  const admissionNo = `ADM${new Date().getFullYear()}${enquiry.id.toString().padStart(4, '0')}`;
  
  const student = await studentService.createStudent({
    name: enquiry.student_name,
    email: enquiry.email,
    admission_no: admissionNo,
    class_id: classId,
    section: section || 'A',
    parent_name: enquiry.parent_name,
    parent_contact: enquiry.contact,
    gender: 'Other', // defaults
    dob: '2010-01-01',
    address: 'Admitted from Online Registration',
    transport_mode: enquiry.transport_mode,
    profile_image: enquiry.student_photo || null
  });

  // Mark enquiry as approved
  await enquiry.update({ status: 'approved' });

  return student;
};

module.exports = {
  getAllEnquiries,
  submitEnquiry,
  updateEnquiryStatus,
  convertEnquiryToStudent
};
