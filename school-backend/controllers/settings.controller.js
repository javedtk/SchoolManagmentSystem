const settingsService = require('../services/settings.service');

const getAllSettings = async (req, res, next) => {
  try {
    const list = await settingsService.getAllSettings();
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const list = await settingsService.updateSettings(req.body);
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSettings,
  updateSettings
};
