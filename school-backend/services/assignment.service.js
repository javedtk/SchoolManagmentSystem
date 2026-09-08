const { Assignment, AssignmentSubmission, Student, User, Class, Subject } = require('../models');

// Assignments Operations
const getAllAssignments = async (where = {}) => {
  return Assignment.findAll({
    where,
    include: [
      { model: Class, attributes: ['name', 'section'] },
      { model: Subject, attributes: ['name', 'code'] }
    ]
  });
};

const getAssignmentById = async (id) => {
  const assignment = await Assignment.findByPk(id, {
    include: [
      { model: Class, attributes: ['name', 'section'] },
      { model: Subject, attributes: ['name', 'code'] }
    ]
  });
  if (!assignment) {
    throw { status: 404, message: 'Assignment not found.' };
  }
  return assignment;
};

const createAssignment = async (assignmentData) => {
  return Assignment.create(assignmentData);
};

const updateAssignment = async (id, updateData) => {
  const assignment = await Assignment.findByPk(id);
  if (!assignment) {
    throw { status: 404, message: 'Assignment not found.' };
  }
  return assignment.update(updateData);
};

const deleteAssignment = async (id) => {
  const assignment = await Assignment.findByPk(id);
  if (!assignment) {
    throw { status: 404, message: 'Assignment not found.' };
  }
  await assignment.destroy();
  return { message: 'Assignment deleted successfully.' };
};

// Submissions Operations
const submitAssignment = async (submissionData) => {
  // Check if student already submitted this assignment
  const existing = await AssignmentSubmission.findOne({
    where: {
      assignment_id: submissionData.assignment_id,
      student_id: submissionData.student_id
    }
  });

  if (existing) {
    return existing.update({
      file: submissionData.file,
      submitted_at: new Date(),
      status: 'submitted'
    });
  }

  return AssignmentSubmission.create(submissionData);
};

const getSubmissionsForAssignment = async (assignmentId) => {
  return AssignmentSubmission.findAll({
    where: { assignment_id: assignmentId },
    include: [
      {
        model: Student,
        include: [{ model: User, attributes: ['name', 'email'] }]
      }
    ]
  });
};

const gradeSubmission = async (submissionId, gradeData) => {
  const submission = await AssignmentSubmission.findByPk(submissionId);
  if (!submission) {
    throw { status: 404, message: 'Submission not found.' };
  }
  return submission.update({
    status: 'graded',
    remarks: gradeData.remarks
  });
};

const getStudentSubmissions = async (studentId) => {
  return AssignmentSubmission.findAll({
    where: { student_id: studentId },
    include: [
      {
        model: Assignment,
        include: [{ model: Subject, attributes: ['name', 'code'] }]
      }
    ]
  });
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
