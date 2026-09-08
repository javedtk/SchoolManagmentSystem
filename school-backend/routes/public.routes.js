const express = require('express');
const router = express.Router();

const cmsController = require('../controllers/cms.controller');
const classController = require('../controllers/class.controller');
const teacherController = require('../controllers/teacher.controller');
const admissionController = require('../controllers/admission.controller');
const eventController = require('../controllers/event.controller');
const achievementController = require('../controllers/achievement.controller');
const galleryController = require('../controllers/gallery.controller');
const jobController = require('../controllers/job.controller');
const jobApplicationController = require('../controllers/jobApplication.controller');
const settingsController = require('../controllers/settings.controller');
const uploadMiddleware = require('../middlewares/upload.middleware');

// CMS Pages
router.get('/cms/:pageKey', cmsController.getCmsPageByKey);

// Settings (Public Info like phone, address, etc.)
router.get('/settings', settingsController.getAllSettings);

// Classes (Dynamic display)
router.get('/classes', classController.getAllClasses);

// Faculty (Teachers profile list)
router.get('/faculty', teacherController.getAllTeachers);

// Admissions enquiry submit
router.post('/admissions/enquiry', uploadMiddleware.single('student_photo'), admissionController.submitEnquiry);

// Events list
router.get('/events', eventController.getAllEvents);

// Achievements list
router.get('/achievements', achievementController.getAllAchievements);

// Gallery
router.get('/gallery/albums', galleryController.getAllAlbums);
router.get('/gallery/albums/:id', galleryController.getAlbumById);

// Career Openings
router.get('/career/jobs', jobController.getAllJobs);
router.post('/career/apply', uploadMiddleware.single('resume'), jobApplicationController.applyForJob);

module.exports = router;
