const assignmentService = require('../services/assignment.service');
const { Student } = require('../models');

// Assignments
const getAllAssignments = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.class_id) filters.class_id = req.query.class_id;
    if (req.query.subject_id) filters.subject_id = req.query.subject_id;
    if (req.user.role === 'teacher') filters.teacher_id = req.user.profileId;
    if (req.user.role === 'student') {
      const student = await Student.findOne({ where: { id: req.user.profileId } });
      filters.class_id = student ? student.class_id : null;
    }

    const assignments = await assignmentService.getAllAssignments(filters);
    return res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
};


const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    return res.status(200).json(assignment);
  } catch (error) {
    next(error);
  }
};

const createAssignment = async (req, res, next) => {
  try {
    const assignmentData = req.body;
    if (req.file) {
      assignmentData.attachment = `uploads/attachments/${req.file.filename}`;
    }
    // Set teacher from logged-in profile
    assignmentData.teacher_id = req.user.profileId;

    const assignment = await assignmentService.createAssignment(assignmentData);
    return res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};

const updateAssignment = async (req, res, next) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.attachment = `uploads/attachments/${req.file.filename}`;
    }
    const assignment = await assignmentService.updateAssignment(req.params.id, updateData);
    return res.status(200).json(assignment);
  } catch (error) {
    next(error);
  }
};

const deleteAssignment = async (req, res, next) => {
  try {
    const result = await assignmentService.deleteAssignment(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Submissions
const submitAssignment = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Assignment submission file is required.' });
    }

    const submissionData = {
      assignment_id: req.body.assignment_id,
      student_id: req.user.profileId,
      file: `uploads/attachments/${req.file.filename}`,
      status: 'submitted'
    };

    const submission = await assignmentService.submitAssignment(submissionData);
    return res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
};

const getSubmissionsForAssignment = async (req, res, next) => {
  try {
    const submissions = await assignmentService.getSubmissionsForAssignment(req.params.id);
    return res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};

const gradeSubmission = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const submission = await assignmentService.gradeSubmission(req.params.submissionId, { remarks });
    return res.status(200).json(submission);
  } catch (error) {
    next(error);
  }
};

const getStudentSubmissions = async (req, res, next) => {
  try {
    const submissions = await assignmentService.getStudentSubmissions(req.user.profileId);
    return res.status(200).json(submissions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissionsForAssignment,
  gradeSubmission,
  getStudentSubmissions
};
