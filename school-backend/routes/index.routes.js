const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const publicRoutes = require('./public.routes');
const userRoutes = require('./user.routes');
const studentRoutes = require('./student.routes');
const teacherRoutes = require('./teacher.routes');
const classRoutes = require('./class.routes');
const subjectRoutes = require('./subject.routes');
const attendanceRoutes = require('./attendance.routes');
const assignmentRoutes = require('./assignment.routes');
const resultRoutes = require('./result.routes');
const timetableRoutes = require('./timetable.routes');
const feeRoutes = require('./fee.routes');
const admissionRoutes = require('./admission.routes');
const eventRoutes = require('./event.routes');
const achievementRoutes = require('./achievement.routes');
const galleryRoutes = require('./gallery.routes');
const jobRoutes = require('./job.routes');
const jobApplicationRoutes = require('./jobApplication.routes');
const cmsRoutes = require('./cms.routes');
const settingsRoutes = require('./settings.routes');
const dashboardRoutes = require('./dashboard.routes');

// Public & Auth
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);

// Admin Master CRUDs
router.use('/admin/users', userRoutes);
router.use('/admin/students', studentRoutes);
router.use('/admin/teachers', teacherRoutes);
router.use('/admin/classes', classRoutes);
router.use('/admin/subjects', subjectRoutes);
router.use('/admin/events', eventRoutes);
router.use('/admin/achievements', achievementRoutes);
router.use('/admin/gallery', galleryRoutes);
router.use('/admin/jobs', jobRoutes);
router.use('/admin/job-applications', jobApplicationRoutes);
router.use('/admin/cms', cmsRoutes);
router.use('/admin/settings', settingsRoutes);
router.use('/admin/admissions', admissionRoutes);

// Academic Operation Modules
router.use('/attendance', attendanceRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/results', resultRoutes);
router.use('/timetable', timetableRoutes);
router.use('/fees', feeRoutes);

// Dashboard
router.use('/common/dashboard', dashboardRoutes);

module.exports = router;
