import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const dashboardApi = {
  getSummary: (teacherId) => api.get('/dashboard/summary', { params: { teacherId } }),
  getWeeklyTrends: (teacherId) => api.get('/dashboard/weekly-trends', { params: { teacherId } }),
  getGradeBreakdown: (teacherId) => api.get('/dashboard/grade-breakdown', { params: { teacherId } }),
  getSubjectBreakdown: (teacherId) => api.get('/dashboard/subject-breakdown', { params: { teacherId } })
};

export const teacherApi = {
  getAllTeachers: () => api.get('/teachers'),
  getTeacherById: (id) => api.get(`/teachers/${id}`)
};

export const activityApi = {
  getActivities: (page = 1, limit = 10) => api.get('/activities/recent', { params: { page, limit } })
};

export default api;
