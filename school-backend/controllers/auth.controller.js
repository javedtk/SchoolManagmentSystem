const authService = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const data = await authService.login(email, password);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const profile = await authService.getProfile(id, role);
    return res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const updateData = req.body;
    
    if (req.file) {
      // Set path if a profile image was uploaded
      const relativePath = `uploads/images/${req.file.filename}`;
      updateData.profile_image = relativePath;
    }

    const updated = await authService.updateProfile(id, updateData);
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    const result = await authService.changePassword(id, currentPassword, newPassword);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getProfile,
  updateProfile,
  changePassword
};
