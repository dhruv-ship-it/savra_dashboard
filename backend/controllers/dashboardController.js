const dashboardService = require('../services/dashboardService');

const dashboardController = {
  async getSummary(req, res) {
    try {
      const { teacherId, period, periodValue } = req.query;
      const summary = await dashboardService.getSummary(teacherId, period, periodValue);
      res.json(summary);
    } catch (error) {
      console.error('Error getting summary:', error);
      res.status(500).json({ error: 'Failed to get summary' });
    }
  },

  async getWeeklyTrends(req, res) {
    try {
      const { teacherId, period, periodValue } = req.query;
      const trends = await dashboardService.getWeeklyTrends(teacherId, period, periodValue);
      res.json(trends);
    } catch (error) {
      console.error('Error getting weekly trends:', error);
      res.status(500).json({ error: 'Failed to get weekly trends' });
    }
  },

  async getGradeBreakdown(req, res) {
    try {
      const { teacherId, period, periodValue } = req.query;
      const breakdown = await dashboardService.getGradeBreakdown(teacherId, period, periodValue);
      res.json(breakdown);
    } catch (error) {
      console.error('Error getting grade breakdown:', error);
      res.status(500).json({ error: 'Failed to get grade breakdown' });
    }
  },

  async getSubjectBreakdown(req, res) {
    try {
      const { teacherId, period, periodValue } = req.query;
      const breakdown = await dashboardService.getSubjectBreakdown(teacherId, period, periodValue);
      res.json(breakdown);
    } catch (error) {
      console.error('Error getting subject breakdown:', error);
      res.status(500).json({ error: 'Failed to get subject breakdown' });
    }
  }
};

module.exports = dashboardController;
