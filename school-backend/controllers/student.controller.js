const studentService = require('../services/student.service');

const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents(req.query);
    return res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    return res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const studentData = req.body;
    if (req.file) {
      studentData.profile_image = `uploads/images/${req.file.filename}`;
    }
    const student = await studentService.createStudent(studentData);
    return res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.profile_image = `uploads/images/${req.file.filename}`;
    }
    const student = await studentService.updateStudent(req.params.id, updateData);
    return res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const result = await studentService.deleteStudent(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
