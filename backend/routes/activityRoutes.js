const express = require('express');
const activityController = require('../controllers/activityController');

const router = express.Router();

router.post('/', activityController.createActivity);
router.get('/recent', activityController.getRecentActivities);

module.exports = router;
