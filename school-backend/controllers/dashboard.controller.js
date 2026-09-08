const dashboardService = require('../services/dashboard.service');

const getDashboardStats = async (req, res, next) => {
  try {
    const role = req.user.role;
    const profileId = req.user.profileId;

    if (role === 'super_admin') {
      const stats = await dashboardService.getAdminDashboardStats();
      return res.status(200).json(stats);
    } else if (role === 'teacher') {
      const stats = await dashboardService.getTeacherDashboardStats(profileId);
      return res.status(200).json(stats);
    } else if (role === 'student') {
      const stats = await dashboardService.getStudentDashboardStats(profileId);
      return res.status(200).json(stats);
    } else {
      return res.status(400).json({ message: 'Unknown role or dashboard type.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
