const classService = require('../services/class.service');

const getAllClasses = async (req, res, next) => {
  try {
    const classes = await classService.getAllClasses();
    return res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
};

const getClassById = async (req, res, next) => {
  try {
    const cls = await classService.getClassById(req.params.id);
    return res.status(200).json(cls);
  } catch (error) {
    next(error);
  }
};

const createClass = async (req, res, next) => {
  try {
    const cls = await classService.createClass(req.body);
    return res.status(201).json(cls);
  } catch (error) {
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const cls = await classService.updateClass(req.params.id, req.body);
    return res.status(200).json(cls);
  } catch (error) {
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const result = await classService.deleteClass(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};
