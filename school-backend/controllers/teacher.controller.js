const teacherService = require('../services/teacher.service');

const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await teacherService.getAllTeachers();
    return res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};

const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);
    return res.status(200).json(teacher);
  } catch (error) {
    next(error);
  }
};

const createTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.createTeacher(req.body);
    return res.status(201).json(teacher);
  } catch (error) {
    next(error);
  }
};

const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.updateTeacher(req.params.id, req.body);
    return res.status(200).json(teacher);
  } catch (error) {
    next(error);
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const result = await teacherService.deleteTeacher(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
};
