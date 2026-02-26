const express = require('express');
const teacherController = require('../controllers/teacherController');

const router = express.Router();

router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);

module.exports = router;
