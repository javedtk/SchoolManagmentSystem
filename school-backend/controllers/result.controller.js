const resultService = require('../services/result.service');

// Exams
const getAllExams = async (req, res, next) => {
  try {
    const exams = await resultService.getAllExams();
    return res.status(200).json(exams);
  } catch (error) {
    next(error);
  }
};

const createExam = async (req, res, next) => {
  try {
    const exam = await resultService.createExam(req.body);
    return res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
};

// Results Entries
const enterStudentMarks = async (req, res, next) => {
  try {
    const { marksRecords } = req.body;
    if (!marksRecords || !Array.isArray(marksRecords)) {
      return res.status(400).json({ message: 'marksRecords array is required.' });
    }
    const result = await resultService.enterStudentMarks(marksRecords);
    return res.status(200).json({ message: 'Marks entered successfully.', result });
  } catch (error) {
    next(error);
  }
};

const getResultsByClassAndExam = async (req, res, next) => {
  try {
    const { class_id, exam_id } = req.query;
    if (!class_id || !exam_id) {
      return res.status(400).json({ message: 'class_id and exam_id parameters are required.' });
    }
    const results = await resultService.getResultsByClassAndExam(class_id, exam_id);
    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const getStudentResults = async (req, res, next) => {
  try {
    let studentId = req.user.profileId;
    if (req.user.role !== 'student' && req.params.studentId) {
      studentId = req.params.studentId;
    }
    
    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required.' });
    }

    const results = await resultService.getStudentResults(studentId);
    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const emailStudentReportCard = async (req, res, next) => {
  try {
    const { studentId, examId } = req.params;
    const result = await resultService.emailStudentReportCard(studentId, examId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const downloadReportCard = async (req, res, next) => {
  try {
    const { studentId, examId } = req.params;
    
    const { Student, Exam, Result, Subject, Class, User } = require('../models');
    const pdfService = require('../services/pdf.service');

    const student = await Student.findByPk(studentId, {
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Class }
      ]
    });
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    const exam = await Exam.findByPk(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found.' });

    const results = await Result.findAll({
      where: { student_id: studentId, exam_id: examId },
      include: [{ model: Subject }]
    });
    if (!results.length) return res.status(400).json({ message: 'No results found.' });

    const buffer = await pdfService.generateResultCardPDF(student, exam, results);
    
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Report-${exam.name.replace(/\s+/g, '_')}.pdf`);
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExams,
  createExam,
  enterStudentMarks,
  getResultsByClassAndExam,
  getStudentResults,
  emailStudentReportCard,
  downloadReportCard
};
