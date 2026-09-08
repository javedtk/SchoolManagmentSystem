const { Setting } = require('../models');

const getAllSettings = async () => {
  const settings = await Setting.findAll();
  // Format as a simple key-value object
  const formatted = {};
  settings.forEach(s => {
    formatted[s.key] = s.value;
  });
  return formatted;
};

const getSettingByKey = async (key) => {
  const setting = await Setting.findOne({ where: { key } });
  return setting ? setting.value : null;
};

const updateSettings = async (settingsObject) => {
  const promises = Object.keys(settingsObject).map(async (key) => {
    const value = settingsObject[key];
    const [setting, created] = await Setting.findOrCreate({
      where: { key },
      defaults: { key, value }
    });

    if (!created) {
      await setting.update({ value });
    }
  });

  await Promise.all(promises);
  return getAllSettings();
};

module.exports = {
  getAllSettings,
  getSettingByKey,
  updateSettings
};
