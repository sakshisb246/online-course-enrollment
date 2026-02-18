const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/add', courseController.addCourse);
router.get('/', courseController.getCourses);
router.post('/enroll', courseController.enrollCourse);
router.get('/student/:studentId', courseController.getStudentCourses);

module.exports = router;
