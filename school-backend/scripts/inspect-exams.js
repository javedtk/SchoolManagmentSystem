const { Exam } = require('../models');

async function test() {
  try {
    const exams = await Exam.findAll();
    console.log('--- EXAMS IN DATABASE ---');
    console.log(JSON.stringify(exams, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

test();
