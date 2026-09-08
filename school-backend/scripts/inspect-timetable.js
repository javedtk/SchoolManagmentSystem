const { Timetable, Class, Subject, Teacher, User } = require('../models');

async function inspect() {
  try {
    const entries = await Timetable.findAll({
      include: [
        { model: Class, attributes: ['id', 'name', 'section'] },
        { model: Subject, attributes: ['id', 'name', 'code'] },
        {
          model: Teacher,
          include: [{ model: User, attributes: ['id', 'name'] }]
        }
      ]
    });
    console.log('--- CURRENT TIMETABLE ENTRIES IN DATABASE ---');
    entries.forEach(e => {
      console.log(`ID: ${e.id} | Day: ${e.day} | Period: ${e.period_no} | Time: ${e.start_time} - ${e.end_time} | Class: ${e.Class?.name} ${e.Class?.section} (ID: ${e.class_id}) | Subject: ${e.Subject?.name} (ID: ${e.subject_id}) | Teacher: ${e.Teacher?.User?.name} (ID: ${e.teacher_id})`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error fetching timetable:', err);
    process.exit(1);
  }
}

inspect();
