const timetableService = require('../services/timetable.service');

async function runTest() {
  try {
    const payload = [
      {
        day: 'Monday',
        period_no: 2,
        start_time: '09:00 AM',
        end_time: '09:30 AM',
        class_id: 2,
        subject_id: 5
      },
      {
        day: 'Monday',
        period_no: 4,
        start_time: '10:00 AM',
        end_time: '10:30 AM',
        class_id: 1,
        subject_id: 3
      }
    ];
    // David Miller is Teacher ID: 2
    console.log('Running test update for teacher ID 2...');
    const result = await timetableService.updateTeacherTimetable(2, payload);
    console.log('Result:', result);
    process.exit(0);
  } catch (err) {
    console.error('Error during update:', err);
    process.exit(1);
  }
}

runTest();
