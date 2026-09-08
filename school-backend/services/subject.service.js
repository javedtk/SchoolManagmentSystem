const { Subject, Class } = require('../models');

const getAllSubjects = async () => {
  return Subject.findAll({
    include: [{ model: Class, attributes: ['name', 'section'] }]
  });
};

const getSubjectById = async (id) => {
  const subject = await Subject.findByPk(id, {
    include: [{ model: Class }]
  });
  if (!subject) {
    throw { status: 404, message: 'Subject not found.' };
  }
  return subject;
};

const createSubject = async (subjectData) => {
  return Subject.create(subjectData);
};

const updateSubject = async (id, updateData) => {
  const subject = await Subject.findByPk(id);
  if (!subject) {
    throw { status: 404, message: 'Subject not found.' };
  }
  return subject.update(updateData);
};

const deleteSubject = async (id) => {
  const subject = await Subject.findByPk(id);
  if (!subject) {
    throw { status: 404, message: 'Subject not found.' };
  }
  await subject.destroy();
  return { message: 'Subject deleted successfully.' };
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
