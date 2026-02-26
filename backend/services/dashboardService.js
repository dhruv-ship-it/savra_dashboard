const pool = require('../config/database');

class DashboardService {
  async getSummary(teacherId = null) {
    let query = `
      SELECT 
        COUNT(*) as totalActivities,
        COUNT(CASE WHEN activity_type = 'Lesson Plan' THEN 1 END) as lessonPlans,
        COUNT(CASE WHEN activity_type = 'Quiz' THEN 1 END) as quizzes,
        COUNT(CASE WHEN activity_type = 'Question Paper' THEN 1 END) as questionPapers
      FROM activities
    `;
    const params = [];
    
    if (teacherId) {
      query += ' WHERE teacher_id = ?';
      params.push(teacherId);
    }
    
    const [rows] = await pool.query(query, params);
    return rows[0];
  }

  async getWeeklyTrends(teacherId = null) {
    let query = `
      SELECT 
        CONCAT(YEAR(created_at), '-W', LPAD(WEEK(created_at, 1), 2, '0')) as week,
        activity_type,
        COUNT(*) as count
      FROM activities
    `;
    const params = [];
    
    if (teacherId) {
      query += ' WHERE teacher_id = ?';
      params.push(teacherId);
    }
    
    query += `
      GROUP BY YEARWEEK(created_at, 1), activity_type
      ORDER BY YEARWEEK(created_at, 1)
    `;
    
    const [rows] = await pool.query(query, params);
    
    const trends = {};
    rows.forEach(row => {
      if (!trends[row.week]) {
        trends[row.week] = {
          week: row.week,
          'Lesson Plan': 0,
          'Quiz': 0,
          'Question Paper': 0
        };
      }
      trends[row.week][row.activity_type] = row.count;
    });
    
    return Object.values(trends);
  }

  async getGradeBreakdown(teacherId = null) {
    let query = `
      SELECT grade, COUNT(*) as count
      FROM activities
    `;
    const params = [];
    
    if (teacherId) {
      query += ' WHERE teacher_id = ?';
      params.push(teacherId);
    }
    
    query += ' GROUP BY grade ORDER BY grade';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getSubjectBreakdown(teacherId = null) {
    let query = `
      SELECT subject, COUNT(*) as count
      FROM activities
    `;
    const params = [];
    
    if (teacherId) {
      query += ' WHERE teacher_id = ?';
      params.push(teacherId);
    }
    
    query += ' GROUP BY subject ORDER BY count DESC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }
}

module.exports = new DashboardService();
