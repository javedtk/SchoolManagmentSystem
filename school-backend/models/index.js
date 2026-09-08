const sequelize = require('../config/db.config');
const User = require('./user.model');
const Student = require('./student.model');
const Teacher = require('./teacher.model');
const Class = require('./class.model');
const Subject = require('./subject.model');
const ClassSubject = require('./classSubject.model');
const Attendance = require('./attendance.model');
const Assignment = require('./assignment.model');
const AssignmentSubmission = require('./assignmentSubmission.model');
const Exam = require('./exam.model');
const Result = require('./result.model');
const Timetable = require('./timetable.model');
const FeeStructure = require('./feeStructure.model');
const FeePayment = require('./feePayment.model');
const Admission = require('./admission.model');
const Event = require('./event.model');
const Achievement = require('./achievement.model');
const GalleryAlbum = require('./galleryAlbum.model');
const GalleryMedia = require('./galleryMedia.model');
const Job = require('./job.model');
const JobApplication = require('./jobApplication.model');
const CmsPage = require('./cmsPage.model');
const Setting = require('./setting.model');

// User <-> Student
User.hasOne(Student, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'user_id' });

// User <-> Teacher
User.hasOne(Teacher, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Teacher.belongsTo(User, { foreignKey: 'user_id' });

// Class <-> Student
Class.hasMany(Student, { foreignKey: 'class_id' });
Student.belongsTo(Class, { foreignKey: 'class_id' });

// Teacher <-> Class (Class Teacher)
Teacher.hasOne(Class, { foreignKey: 'class_teacher_id' });
Class.belongsTo(Teacher, { as: 'ClassTeacher', foreignKey: 'class_teacher_id' });

// Class <-> Subject
Class.hasMany(Subject, { foreignKey: 'class_id' });
Subject.belongsTo(Class, { foreignKey: 'class_id' });

// Class <-> Subject <-> Teacher via ClassSubject
Class.belongsToMany(Subject, { through: ClassSubject, foreignKey: 'class_id' });
Subject.belongsToMany(Class, { through: ClassSubject, foreignKey: 'subject_id' });
ClassSubject.belongsTo(Class, { foreignKey: 'class_id' });
ClassSubject.belongsTo(Subject, { foreignKey: 'subject_id' });
ClassSubject.belongsTo(Teacher, { foreignKey: 'teacher_id' });
Class.hasMany(ClassSubject, { foreignKey: 'class_id' });
Subject.hasMany(ClassSubject, { foreignKey: 'subject_id' });
Teacher.hasMany(ClassSubject, { foreignKey: 'teacher_id' });

// Attendance
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Student, { foreignKey: 'student_id' });
Class.hasMany(Attendance, { foreignKey: 'class_id' });
Attendance.belongsTo(Class, { foreignKey: 'class_id' });

// Assignment
Class.hasMany(Assignment, { foreignKey: 'class_id' });
Assignment.belongsTo(Class, { foreignKey: 'class_id' });
Subject.hasMany(Assignment, { foreignKey: 'subject_id' });
Assignment.belongsTo(Subject, { foreignKey: 'subject_id' });
Teacher.hasMany(Assignment, { foreignKey: 'teacher_id' });
Assignment.belongsTo(Teacher, { foreignKey: 'teacher_id' });

// AssignmentSubmission
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignment_id', onDelete: 'CASCADE' });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignment_id' });
Student.hasMany(AssignmentSubmission, { foreignKey: 'student_id', onDelete: 'CASCADE' });
AssignmentSubmission.belongsTo(Student, { foreignKey: 'student_id' });

// Result
Student.hasMany(Result, { foreignKey: 'student_id' });
Result.belongsTo(Student, { foreignKey: 'student_id' });
Exam.hasMany(Result, { foreignKey: 'exam_id' });
Result.belongsTo(Exam, { foreignKey: 'exam_id' });
Subject.hasMany(Result, { foreignKey: 'subject_id' });
Result.belongsTo(Subject, { foreignKey: 'subject_id' });

// Timetable
Class.hasMany(Timetable, { foreignKey: 'class_id' });
Timetable.belongsTo(Class, { foreignKey: 'class_id' });
Subject.hasMany(Timetable, { foreignKey: 'subject_id' });
Timetable.belongsTo(Subject, { foreignKey: 'subject_id' });
Teacher.hasMany(Timetable, { foreignKey: 'teacher_id' });
Timetable.belongsTo(Teacher, { foreignKey: 'teacher_id' });

// FeeStructure
Class.hasMany(FeeStructure, { foreignKey: 'class_id' });
FeeStructure.belongsTo(Class, { foreignKey: 'class_id' });

// FeePayment
Student.hasMany(FeePayment, { foreignKey: 'student_id' });
FeePayment.belongsTo(Student, { foreignKey: 'student_id' });
FeeStructure.hasMany(FeePayment, { foreignKey: 'fee_structure_id' });
FeePayment.belongsTo(FeeStructure, { foreignKey: 'fee_structure_id' });

// Gallery
GalleryAlbum.hasMany(GalleryMedia, { foreignKey: 'album_id', onDelete: 'CASCADE' });
GalleryMedia.belongsTo(GalleryAlbum, { foreignKey: 'album_id' });

// Jobs
Job.hasMany(JobApplication, { foreignKey: 'job_id', onDelete: 'CASCADE' });
JobApplication.belongsTo(Job, { foreignKey: 'job_id' });

module.exports = {
  sequelize,
  User,
  Student,
  Teacher,
  Class,
  Subject,
  ClassSubject,
  Attendance,
  Assignment,
  AssignmentSubmission,
  Exam,
  Result,
  Timetable,
  FeeStructure,
  FeePayment,
  Admission,
  Event,
  Achievement,
  GalleryAlbum,
  GalleryMedia,
  Job,
  JobApplication,
  CmsPage,
  Setting
};
