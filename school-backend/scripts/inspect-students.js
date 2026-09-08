const { Student, Class, User } = require('../models');

async function test() {
  try {
    const students = await Student.findAll({
      include: [
        { model: Class, attributes: ['name', 'section'] },
        { model: User, attributes: ['name', 'email'] }
      ]
    });
    console.log('--- REGISTERED STUDENTS ---');
    students.forEach(s => {
      console.log(`ID: ${s.id} | Name: ${s.User?.name} | Admission No: ${s.admission_no} | Class: ${s.Class?.name} ${s.Class?.section} (ID: ${s.class_id})`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

test();
