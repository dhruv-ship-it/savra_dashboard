const pool = require('../config/database');

class DashboardService {
  async getSummary(teacherId = null, period = null, periodValue = null) {
    let query = `
      SELECT 
        COUNT(*) as totalActivities,
        COUNT(CASE WHEN activity_type = 'Lesson Plan' THEN 1 END) as lessonPlans,
        COUNT(CASE WHEN activity_type = 'Quiz' THEN 1 END) as quizzes,
        COUNT(CASE WHEN activity_type = 'Question Paper' THEN 1 END) as questionPapers
      FROM activities
      WHERE 1=1
    `;
    const params = [];
    
    if (teacherId) {
      query += ' AND teacher_id = ?';
      params.push(teacherId);
    }
    
    if (period && periodValue) {
      const dateRange = this.getDateRange(period, periodValue);
      if (dateRange.start && dateRange.end) {
        query += ' AND created_at >= ? AND created_at <= ?';
        params.push(dateRange.start, dateRange.end);
      }
    }
    
    const [rows] = await pool.query(query, params);
    return rows[0];
  }

  async getWeeklyTrends(teacherId = null, period = null, periodValue = null) {
    let query = `
      SELECT 
        CONCAT(YEAR(created_at), '-W', LPAD(WEEK(created_at, 1), 2, '0')) as week,
        activity_type,
        COUNT(*) as count
      FROM activities
      WHERE 1=1
    `;
    const params = [];
    
    if (teacherId) {
      query += ' AND teacher_id = ?';
      params.push(teacherId);
    }
    
    if (period && periodValue) {
      const dateRange = this.getDateRange(period, periodValue);
      if (dateRange.start && dateRange.end) {
        query += ' AND created_at >= ? AND created_at <= ?';
        params.push(dateRange.start, dateRange.end);
      }
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

  async getGradeBreakdown(teacherId = null, period = null, periodValue = null) {
    let query = `
      SELECT grade, COUNT(*) as count
      FROM activities
      WHERE 1=1
    `;
    const params = [];
    
    if (teacherId) {
      query += ' AND teacher_id = ?';
      params.push(teacherId);
    }
    
    if (period && periodValue) {
      const dateRange = this.getDateRange(period, periodValue);
      if (dateRange.start && dateRange.end) {
        query += ' AND created_at >= ? AND created_at <= ?';
        params.push(dateRange.start, dateRange.end);
      }
    }
    
    query += ' GROUP BY grade ORDER BY grade';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getSubjectBreakdown(teacherId = null, period = null, periodValue = null) {
    let query = `
      SELECT subject, COUNT(*) as count
      FROM activities
      WHERE 1=1
    `;
    const params = [];
    
    if (teacherId) {
      query += ' AND teacher_id = ?';
      params.push(teacherId);
    }
    
    if (period && periodValue) {
      const dateRange = this.getDateRange(period, periodValue);
      if (dateRange.start && dateRange.end) {
        query += ' AND created_at >= ? AND created_at <= ?';
        params.push(dateRange.start, dateRange.end);
      }
    }
    
    query += ' GROUP BY subject ORDER BY count DESC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }

  getDateRange(period, periodValue) {
    try {
      if (!period || !periodValue) {
        return { start: null, end: null };
      }

      let start, end;
      
      switch (period) {
        case 'weekly': {
          // periodValue format: YYYY-WXX
          const [year, weekStr] = periodValue.split('-W');
          const week = parseInt(weekStr);
          
          if (!year || !week || week < 1 || week > 53) {
            return { start: null, end: null };
          }
          
          start = this.getDateOfWeek(parseInt(year), week, 1); // Monday
          end = this.getDateOfWeek(parseInt(year), week, 7); // Sunday
          end.setHours(23, 59, 59, 999);
          break;
        }
        
        case 'monthly': {
          // periodValue format: YYYY-MM
          const [year, month] = periodValue.split('-');
          
          if (!year || !month || month < 1 || month > 12) {
            return { start: null, end: null };
          }
          
          start = new Date(parseInt(year), parseInt(month) - 1, 1);
          end = new Date(parseInt(year), parseInt(month), 0); // Last day of month
          end.setHours(23, 59, 59, 999);
          break;
        }
        
        case 'yearly': {
          // periodValue format: YYYY
          const year = parseInt(periodValue);
          
          if (!year || year < 2020 || year > 2030) {
            return { start: null, end: null };
          }
          
          start = new Date(year, 0, 1);
          end = new Date(year, 11, 31);
          end.setHours(23, 59, 59, 999);
          break;
        }
        
        default:
          return { start: null, end: null };
      }
      
      return {
        start: start.toISOString().slice(0, 19).replace('T', ' '),
        end: end.toISOString().slice(0, 19).replace('T', ' ')
      };
    } catch (error) {
      console.error('Error in getDateRange:', error);
      return { start: null, end: null };
    }
  }

  getDateOfWeek(year, week, dayOfWeek) {
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    const day = date.getDay();
    const diff = date.getDate() - day + (dayOfWeek === 0 ? 7 : dayOfWeek);
    return new Date(date.setDate(diff));
  }
}

module.exports = new DashboardService();
