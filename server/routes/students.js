var express = require('express');
var router = express.Router();
var students = require('../business/students');

router.get("/", students.getAllStudents);
router.get("/progress", students.getAllProgress);
router.get("/:id/studied", students.getStudiedById);
router.get("/:id/profile", students.getProfile);
router.post('/viewCourse/:courseId', students.viewCourse);
router.put("/:id/password-initial", students.resetPassword);
router.put("/:id", students.updateInfo);

module.exports = router;