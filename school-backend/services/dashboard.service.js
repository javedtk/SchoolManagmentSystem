const {
  Student,
  Teacher,
  Class,
  FeePayment,
  FeeStructure,
  Admission,
  JobApplication,
  Assignment,
  AssignmentSubmission,
  Timetable,
  Attendance,
  Event,
  Result,
  User,
  Exam,
  Subject
} = require('../models');
const { Op } = require('sequelize');

const getAdminDashboardStats = async () => {
  // Counts
  const totalStudents = await Student.count();
  const totalTeachers = await Teacher.count();
  const totalClasses = await Class.count();
  const totalAdmissionsEnquiry = await Admission.count({ where: { status: 'pending' } });
  const totalJobApplications = await JobApplication.count({ where: { status: 'applied' } });

  // Fees Calculations
  const payments = await FeePayment.findAll();
  const totalFeesCollected = payments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);

  // Simple pending fees calculation:
  // (Total student * fee structure amount) - paid fees
  const students = await Student.findAll();
  const structures = await FeeStructure.findAll();
  let totalFeeRequired = 0;
  students.forEach(student => {
    // Find structures for this student's class
    const studentStructures = structures.filter(s => s.class_id === student.class_id || s.class_id === null);
    studentStructures.forEach(struct => {
      totalFeeRequired += parseFloat(struct.amount);
    });
  });
  const totalFeesPending = Math.max(0, totalFeeRequired - totalFeesCollected);

  // Charts data mock/aggregations
  // Gender Ratio
  const maleCount = await Student.count({ where: { gender: 'Male' } });
  const femaleCount = await Student.count({ where: { gender: 'Female' } });
  const otherCount = await Student.count({ where: { gender: { [Op.notIn]: ['Male', 'Female'] } } });

  // Enrollment by class
  const classesList = await Class.findAll({
    include: [{ model: Student, attributes: ['id'] }]
  });
  const enrollmentTrend = classesList.map(c => ({
    name: `${c.name}-${c.section}`,
    value: c.Students.length
  }));

  // Attendance overall percentage
  const totalAttendanceRecords = await Attendance.count();
  const presentRecords = await Attendance.count({ where: { status: 'present' } });
  const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 100.00;

  return {
    stats: {
      students: totalStudents,
      teachers: totalTeachers,
      classes: totalClasses,
      feesCollected: parseFloat(totalFeesCollected.toFixed(2)),
      feesPending: parseFloat(totalFeesPending.toFixed(2)),
      pendingAdmissions: totalAdmissionsEnquiry,
      jobApplications: totalJobApplications
    },
    charts: {
      genderRatio: [
        { name: 'Male', value: maleCount },
        { name: 'Female', value: femaleCount },
        { name: 'Other', value: otherCount }
      ],
      enrollmentTrend,
      attendanceRate: parseFloat(attendanceRate.toFixed(2))
    }
  };
};

const getTeacherDashboardStats = async (teacherId) => {
  const teacher = await Teacher.findByPk(teacherId);
  if (!teacher) {
    throw { status: 404, message: 'Teacher profile not found.' };
  }

  // Assigned Classes & Subjects
  const { ClassSubject, Subject, Timetable } = require('../models');
  const classSubjects = await ClassSubject.findAll({
    where: { teacher_id: teacherId },
    include: [
      { model: Class },
      { model: Subject }
    ]
  });

  // Fallback / merge with Timetable entries so scheduled classes automatically load
  const timetableEntries = await Timetable.findAll({
    where: { teacher_id: teacherId },
    include: [
      { model: Class },
      { model: Subject }
    ]
  });

  const existingKeys = new Set(classSubjects.map(cs => `${cs.class_id}:${cs.subject_id}`));
  for (const entry of timetableEntries) {
    const key = `${entry.class_id}:${entry.subject_id}`;
    if (!existingKeys.has(key) && entry.Class && entry.Subject) {
      existingKeys.add(key);
      classSubjects.push({
        id: `t-${entry.id}`,
        class_id: entry.class_id,
        subject_id: entry.subject_id,
        teacher_id: teacherId,
        Class: entry.Class,
        Subject: entry.Subject
      });
    }
  }

  const uniqueClasses = [...new Set(classSubjects.map(cs => cs.class_id))];
  const totalStudents = await Student.count({
    where: { class_id: { [Op.in]: uniqueClasses } }
  });

  // Pending assignments to grade
  const assignments = await Assignment.findAll({ where: { teacher_id: teacherId } });
  const assignmentIds = assignments.map(a => a.id);
  const pendingGrading = await AssignmentSubmission.count({
    where: {
      assignment_id: { [Op.in]: assignmentIds },
      status: 'submitted'
    }
  });

  // Today's timetable slots
  // We determine what day is today
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const todayTimetable = await Timetable.findAll({
    where: {
      teacher_id: teacherId,
      day: todayName
    },
    include: [
      { model: Class, attributes: ['name', 'section'] },
      { model: Subject, attributes: ['name', 'code'] }
    ],
    order: [['period_no', 'ASC']]
  });

  const plainClassSubjects = classSubjects.map(cs => {
    return typeof cs.toJSON === 'function' ? cs.toJSON() : cs;
  });

  return {
    stats: {
      assignedClasses: uniqueClasses.length,
      assignedSubjects: classSubjects.length,
      totalStudents,
      pendingGrading
    },
    todayTimetable,
    classSubjects: plainClassSubjects
  };
};

const getStudentDashboardStats = async (studentId) => {
  const student = await Student.findByPk(studentId, {
    include: [{ model: Class }]
  });
  if (!student) {
    throw { status: 404, message: 'Student profile not found.' };
  }

  // Attendance rate & breakdown
  const totalAttendance = await Attendance.count({ where: { student_id: studentId } });
  const presentCount = await Attendance.count({ where: { student_id: studentId, status: 'present' } });
  const absentCount = await Attendance.count({ where: { student_id: studentId, status: 'absent' } });
  const leaveCount = await Attendance.count({ where: { student_id: studentId, status: 'leave' } });
  const attendancePercentage = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 100.00;

  // Pending fees & breakdown
  const feeStatus = await require('./fee.service').getStudentFeeStatus(studentId);
  const pendingFees = feeStatus.reduce((sum, item) => sum + item.balance, 0);
  const feesPaidAmount = feeStatus.reduce((sum, item) => sum + item.amountPaid, 0);

  // Upcoming Events (next 7 days)
  const upcomingEvents = await Event.findAll({
    where: {
      event_date: {
        [Op.gte]: new Date()
      }
    },
    limit: 5,
    order: [['event_date', 'ASC']]
  });

  // Latest results
  const latestResults = await Result.findAll({
    where: { student_id: studentId },
    limit: 5,
    include: [
      { model: Subject, attributes: ['name'] },
      { model: Exam, attributes: ['name'] }
    ],
    order: [['created_at', 'DESC']]
  });

  // Assignments calculation & breakdown
  const classId = student.class_id;
  let pendingAssignmentsCount = 0;
  let gradedAssignmentsCount = 0;
  let submittedAssignmentsCount = 0;

  if (classId) {
    const totalClassAssignments = await Assignment.findAll({
      where: { class_id: classId }
    });
    const assignmentIds = totalClassAssignments.map(a => a.id);
    
    // Fetch all submissions for these assignments by this student
    const studentSubmissions = await AssignmentSubmission.findAll({
      where: {
        assignment_id: { [Op.in]: assignmentIds },
        student_id: studentId
      }
    });

    gradedAssignmentsCount = studentSubmissions.filter(s => s.status === 'graded').length;
    submittedAssignmentsCount = studentSubmissions.filter(s => s.status === 'submitted').length;
    pendingAssignmentsCount = Math.max(0, totalClassAssignments.length - studentSubmissions.length);
  }

  // Academic performance by subject averages
  const allResults = await Result.findAll({
    where: { student_id: studentId },
    include: [{ model: Subject, attributes: ['name'] }]
  });

  const subjectAverages = {};
  allResults.forEach(r => {
    const subName = r.Subject ? r.Subject.name : 'Unknown';
    const percentage = r.max_marks > 0 ? (parseFloat(r.marks_obtained) / parseFloat(r.max_marks)) * 100 : 0;
    if (!subjectAverages[subName]) {
      subjectAverages[subName] = { total: 0, count: 0 };
    }
    subjectAverages[subName].total += percentage;
    subjectAverages[subName].count += 1;
  });

  const performanceData = Object.keys(subjectAverages).map(sub => ({
    subject: sub,
    score: parseFloat((subjectAverages[sub].total / subjectAverages[sub].count).toFixed(2))
  }));

  return {
    stats: {
      attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
      pendingFees: parseFloat(pendingFees.toFixed(2)),
      className: student.Class ? `${student.Class.name}-${student.Class.section}` : 'Unassigned',
      pendingAssignments: pendingAssignmentsCount
    },
    charts: {
      attendance: [
        { name: 'Present', value: presentCount },
        { name: 'Absent', value: absentCount },
        { name: 'Leave', value: leaveCount }
      ],
      assignments: [
        { name: 'Graded', value: gradedAssignmentsCount },
        { name: 'Submitted', value: submittedAssignmentsCount },
        { name: 'Pending', value: pendingAssignmentsCount }
      ],
      fees: [
        { name: 'Paid', value: parseFloat(feesPaidAmount.toFixed(2)) },
        { name: 'Pending', value: parseFloat(pendingFees.toFixed(2)) }
      ],
      performance: performanceData
    },
    upcomingEvents,
    latestResults
  };
};

module.exports = {
  getAdminDashboardStats,
  getTeacherDashboardStats,
  getStudentDashboardStats
};
