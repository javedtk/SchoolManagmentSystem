const { Result, Exam, Student, User, Subject, Class } = require('../models');
const pdfService = require('./pdf.service');
const emailService = require('./email.service');

// Exam Management
const getAllExams = async () => {
  return Exam.findAll();
};

const createExam = async (examData) => {
  return Exam.create(examData);
};

// Results Entries
const enterStudentMarks = async (marksRecords) => {
  const promises = marksRecords.map(async (record) => {
    // Calculate grade
    const percentage = (record.marks_obtained / record.max_marks) * 100;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';
    else if (percentage >= 40) grade = 'E';

    const existing = await Result.findOne({
      where: {
        student_id: record.student_id,
        exam_id: record.exam_id,
        subject_id: record.subject_id
      }
    });

    if (existing) {
      return existing.update({
        marks_obtained: record.marks_obtained,
        max_marks: record.max_marks,
        grade
      });
    } else {
      return Result.create({
        student_id: record.student_id,
        exam_id: record.exam_id,
        subject_id: record.subject_id,
        marks_obtained: record.marks_obtained,
        max_marks: record.max_marks,
        grade
      });
    }
  });

  return Promise.all(promises);
};

const getResultsByClassAndExam = async (classId, examId) => {
  return Result.findAll({
    where: { exam_id: examId },
    include: [
      {
        model: Student,
        where: { class_id: classId },
        include: [{ model: User, attributes: ['name'] }]
      },
      {
        model: Subject,
        attributes: ['name', 'code']
      }
    ]
  });
};

const getStudentResults = async (studentId) => {
  const results = await Result.findAll({
    where: { student_id: studentId },
    include: [
      { model: Exam },
      { model: Subject, attributes: ['name', 'code'] }
    ]
  });

  // Group results by exam
  const grouped = {};
  results.forEach(res => {
    const examId = res.exam_id;
    if (!grouped[examId]) {
      grouped[examId] = {
        exam: res.Exam,
        subjects: []
      };
    }
    grouped[examId].subjects.push({
      subject_id: res.subject_id,
      name: res.Subject.name,
      code: res.Subject.code,
      marks_obtained: res.marks_obtained,
      max_marks: res.max_marks,
      grade: res.grade
    });
  });

  return Object.values(grouped);
};

const emailStudentReportCard = async (studentId, examId) => {
  const student = await Student.findByPk(studentId, {
    include: [
      { model: User, attributes: ['name', 'email'] },
      { model: Class }
    ]
  });
  
  if (!student) {
    throw { status: 404, message: 'Student not found.' };
  }

  const exam = await Exam.findByPk(examId);
  if (!exam) {
    throw { status: 404, message: 'Exam not found.' };
  }

  const results = await Result.findAll({
    where: { student_id: studentId, exam_id: examId },
    include: [{ model: Subject }]
  });

  if (!results.length) {
    throw { status: 400, message: 'No results found for this student and exam.' };
  }

  // Generate PDF report card buffer
  const pdfBuffer = await pdfService.generateResultCardPDF(student, exam, results);

  // Email report card to student/parent
  const userEmail = student.User ? student.User.email : null;
  const userName = student.User ? student.User.name : 'Student';

  if (userEmail) {
    await emailService.sendResultEmail(userEmail, userName, pdfBuffer, exam.name);
    return { message: `Report card emailed successfully to ${userEmail}` };
  } else {
    throw { status: 400, message: 'Student email not configured.' };
  }
};

module.exports = {
  getAllExams,
  createExam,
  enterStudentMarks,
  getResultsByClassAndExam,
  getStudentResults,
  emailStudentReportCard
};
