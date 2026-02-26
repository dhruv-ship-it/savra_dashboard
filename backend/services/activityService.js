const pool = require('../config/database');

class ActivityService {
  async createActivity(teacherId, grade, subject, activityType, createdAt) {
    const query = `
      INSERT INTO activities (teacher_id, grade, subject, activity_type, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    try {
      const [result] = await pool.query(query, [
        teacherId,
        grade,
        subject,
        activityType,
        createdAt || new Date()
      ]);
      
      return {
        id: result.insertId,
        teacherId,
        grade,
        subject,
        activityType,
        createdAt: createdAt || new Date()
      };
    } catch (error) {
      // Handle duplicate entry (MySQL error code 1062)
      if (error.code === 'ER_DUP_ENTRY') {
        const duplicateError = new Error('Activity already exists for this teacher, grade, subject, type, and timestamp');
        duplicateError.code = 'DUPLICATE_ENTRY';
        duplicateError.statusCode = 409;
        throw duplicateError;
      }
      
      // Handle foreign key constraint violation (MySQL error code 1452)
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        const fkError = new Error('Teacher not found');
        fkError.code = 'TEACHER_NOT_FOUND';
        fkError.statusCode = 404;
        throw fkError;
      }
      
      throw error;
    }
  }

  async getRecentActivities(limit = 50, offset = 0) {
    const query = `
      SELECT 
        a.id,
        a.teacher_id as teacherId,
        t.name as teacherName,
        a.grade,
        a.subject,
        a.activity_type as activityType,
        a.created_at as createdAt
      FROM activities a
      JOIN teachers t ON a.teacher_id = t.id
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.query(query, [limit, offset]);
    return rows;
  }

  async getTotalActivitiesCount() {
    const query = 'SELECT COUNT(*) as total FROM activities';
    const [rows] = await pool.query(query);
    return rows[0].total;
  }
}

module.exports = new ActivityService();
