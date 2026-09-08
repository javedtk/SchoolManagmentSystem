const { User } = require('../models');

const getAllUsers = async (where = {}) => {
  return User.findAll({
    where,
    attributes: { exclude: ['password'] }
  });
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    throw { status: 404, message: 'User not found.' };
  }
  return user;
};

const createUser = async (userData) => {
  return User.create(userData);
};

const updateUser = async (id, updateData) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw { status: 404, message: 'User not found.' };
  }
  return user.update(updateData);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw { status: 404, message: 'User not found.' };
  }
  // Safe delete: change status to inactive
  return user.update({ status: 'inactive' });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
