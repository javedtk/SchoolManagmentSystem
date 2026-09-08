const { Class, Teacher, User } = require('../models');

const getAllClasses = async () => {
  return Class.findAll({
    include: [
      {
        model: Teacher,
        as: 'ClassTeacher',
        include: [{ model: User, attributes: ['name', 'email'] }]
      }
    ]
  });
};

const getClassById = async (id) => {
  const cls = await Class.findByPk(id, {
    include: [
      {
        model: Teacher,
        as: 'ClassTeacher',
        include: [{ model: User, attributes: ['name', 'email'] }]
      }
    ]
  });
  if (!cls) {
    throw { status: 404, message: 'Class not found.' };
  }
  return cls;
};

const createClass = async (classData) => {
  return Class.create(classData);
};

const updateClass = async (id, updateData) => {
  const cls = await Class.findByPk(id);
  if (!cls) {
    throw { status: 404, message: 'Class not found.' };
  }
  return cls.update(updateData);
};

const deleteClass = async (id) => {
  const cls = await Class.findByPk(id);
  if (!cls) {
    throw { status: 404, message: 'Class not found.' };
  }
  await cls.destroy();
  return { message: 'Class deleted successfully.' };
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};
