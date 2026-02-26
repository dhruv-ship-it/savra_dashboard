const express = require('express');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/summary', dashboardController.getSummary);
router.get('/weekly-trends', dashboardController.getWeeklyTrends);
router.get('/grade-breakdown', dashboardController.getGradeBreakdown);
router.get('/subject-breakdown', dashboardController.getSubjectBreakdown);

module.exports = router;
