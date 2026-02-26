const teacherService = require('../services/teacherService');

const teacherController = {
  async getAllTeachers(req, res) {
    try {
      const teachers = await teacherService.getAllTeachers();
      res.json(teachers);
    } catch (error) {
      console.error('Error getting teachers:', error);
      res.status(500).json({ error: 'Failed to get teachers' });
    }
  },

  async getTeacherById(req, res) {
    try {
      const { id } = req.params;
      const teacher = await teacherService.getTeacherById(id);
      
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      
      res.json(teacher);
    } catch (error) {
      console.error('Error getting teacher:', error);
      res.status(500).json({ error: 'Failed to get teacher details' });
    }
  }
};

module.exports = teacherController;
