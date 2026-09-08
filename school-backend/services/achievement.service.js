const { Achievement } = require('../models');

const getAllAchievements = async () => {
  return Achievement.findAll({ order: [['year', 'DESC']] });
};

const getAchievementById = async (id) => {
  const ach = await Achievement.findByPk(id);
  if (!ach) {
    throw { status: 404, message: 'Achievement not found.' };
  }
  return ach;
};

const createAchievement = async (achData) => {
  return Achievement.create(achData);
};

const updateAchievement = async (id, updateData) => {
  const ach = await Achievement.findByPk(id);
  if (!ach) {
    throw { status: 404, message: 'Achievement not found.' };
  }
  return ach.update(updateData);
};

const deleteAchievement = async (id) => {
  const ach = await Achievement.findByPk(id);
  if (!ach) {
    throw { status: 404, message: 'Achievement not found.' };
  }
  await ach.destroy();
  return { message: 'Achievement deleted successfully.' };
};

module.exports = {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
