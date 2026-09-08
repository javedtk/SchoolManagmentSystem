const achievementService = require('../services/achievement.service');

const getAllAchievements = async (req, res, next) => {
  try {
    const list = await achievementService.getAllAchievements();
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const getAchievementById = async (req, res, next) => {
  try {
    const ach = await achievementService.getAchievementById(req.params.id);
    return res.status(200).json(ach);
  } catch (error) {
    next(error);
  }
};

const createAchievement = async (req, res, next) => {
  try {
    const achData = req.body;
    if (req.file) {
      achData.image = `uploads/images/${req.file.filename}`;
    }
    const ach = await achievementService.createAchievement(achData);
    return res.status(201).json(ach);
  } catch (error) {
    next(error);
  }
};

const updateAchievement = async (req, res, next) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.image = `uploads/images/${req.file.filename}`;
    }
    const ach = await achievementService.updateAchievement(req.params.id, updateData);
    return res.status(200).json(ach);
  } catch (error) {
    next(error);
  }
};

const deleteAchievement = async (req, res, next) => {
  try {
    const result = await achievementService.deleteAchievement(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
