const dashboardService = require('../services/dashboard.service');

async function test() {
  try {
    const stats = await dashboardService.getTeacherDashboardStats(1);
    console.log('STATS FOR TEACHER ID 1:', JSON.stringify(stats, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

test();
