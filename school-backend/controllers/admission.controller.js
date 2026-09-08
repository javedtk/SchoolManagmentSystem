const admissionService = require('../services/admission.service');

const getAllEnquiries = async (req, res, next) => {
  try {
    const list = await admissionService.getAllEnquiries();
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const submitEnquiry = async (req, res, next) => {
  try {
    const enquiryData = req.body;
    if (req.file) {
      enquiryData.student_photo = `uploads/images/${req.file.filename}`;
    }
    const enquiry = await admissionService.submitEnquiry(enquiryData);
    return res.status(201).json(enquiry);
  } catch (error) {
    next(error);
  }
};

const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await admissionService.updateEnquiryStatus(req.params.id, status);
    return res.status(200).json(enquiry);
  } catch (error) {
    next(error);
  }
};

const convertEnquiryToStudent = async (req, res, next) => {
  try {
    const { class_id, section } = req.body;
    if (!class_id) {
      return res.status(400).json({ message: 'class_id is required to admit a student.' });
    }
    const student = await admissionService.convertEnquiryToStudent(req.params.id, class_id, section);
    return res.status(200).json({ message: 'Enquiry converted to student successfully.', student });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEnquiries,
  submitEnquiry,
  updateEnquiryStatus,
  convertEnquiryToStudent
};
