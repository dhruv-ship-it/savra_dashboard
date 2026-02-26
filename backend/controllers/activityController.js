const activityService = require('../services/activityService');

const activityController = {
  async createActivity(req, res) {
    try {
      const { teacherId, grade, subject, activityType, createdAt } = req.body;
      
      // Validate required fields
      if (!teacherId || !grade || !subject || !activityType) {
        return res.status(400).json({
          error: 'Missing required fields: teacherId, grade, subject, activityType'
        });
      }
      
      // Validate activity type
      const validTypes = ['Lesson Plan', 'Quiz', 'Question Paper'];
      if (!validTypes.includes(activityType)) {
        return res.status(400).json({
          error: `Invalid activityType. Must be one of: ${validTypes.join(', ')}`
        });
      }
      
      const activity = await activityService.createActivity(
        teacherId,
        grade,
        subject,
        activityType,
        createdAt
      );
      
      res.status(201).json(activity);
    } catch (error) {
      console.error('Error creating activity:', error);
      
      if (error.code === 'DUPLICATE_ENTRY') {
        return res.status(409).json({
          error: error.message,
          code: 'DUPLICATE_ENTRY'
        });
      }
      
      if (error.code === 'TEACHER_NOT_FOUND') {
        return res.status(404).json({
          error: error.message,
          code: 'TEACHER_NOT_FOUND'
        });
      }
      
      res.status(500).json({ error: 'Failed to create activity' });
    }
  },

  async getRecentActivities(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const [activities, totalCount] = await Promise.all([
        activityService.getRecentActivities(limit, offset),
        activityService.getTotalActivitiesCount()
      ]);
      
      res.json({
        activities,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      console.error('Error getting recent activities:', error);
      res.status(500).json({ error: 'Failed to get recent activities' });
    }
  }
};

module.exports = activityController;
