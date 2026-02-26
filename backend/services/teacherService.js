const pool = require('../config/database');

class TeacherService {
  async getAllTeachers() {
    const [rows] = await pool.query('SELECT id, name FROM teachers ORDER BY name');
    return rows;
  }

  async getTeacherById(id) {
    const [teachers] = await pool.query(
      'SELECT id, name FROM teachers WHERE id = ?',
      [id]
    );
    
    if (teachers.length === 0) {
      return null;
    }
    
    const teacher = teachers[0];
    
    const [summary] = await pool.query(`
      SELECT 
        COUNT(*) as totalActivities,
        COUNT(CASE WHEN activity_type = 'Lesson Plan' THEN 1 END) as lessonPlans,
        COUNT(CASE WHEN activity_type = 'Quiz' THEN 1 END) as quizzes,
        COUNT(CASE WHEN activity_type = 'Question Paper' THEN 1 END) as questionPapers
      FROM activities
      WHERE teacher_id = ?
    `, [id]);
    
    const [gradeBreakdown] = await pool.query(`
      SELECT grade, COUNT(*) as count
      FROM activities
      WHERE teacher_id = ?
      GROUP BY grade
      ORDER BY grade
    `, [id]);
    
    const [subjectBreakdown] = await pool.query(`
      SELECT subject, COUNT(*) as count
      FROM activities
      WHERE teacher_id = ?
      GROUP BY subject
      ORDER BY count DESC
    `, [id]);
    
    const [recentActivities] = await pool.query(`
      SELECT 
        id,
        grade,
        subject,
        activity_type as activityType,
        created_at as createdAt
      FROM activities
      WHERE teacher_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `, [id]);
    
    return {
      ...teacher,
      summary: summary[0],
      gradeBreakdown,
      subjectBreakdown,
      recentActivities
    };
  }
}

module.exports = new TeacherService();
