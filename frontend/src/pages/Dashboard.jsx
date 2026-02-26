import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';
import TeacherFilter from '../components/TeacherFilter';
import SummaryCards from '../components/SummaryCards';
import WeeklyTrendsChart from '../components/WeeklyTrendsChart';
import ActivityTypeChart from '../components/ActivityTypeChart';
import GradeChart from '../components/GradeChart';
import SubjectChart from '../components/SubjectChart';

function Dashboard() {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [summary, setSummary] = useState(null);
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [gradeBreakdown, setGradeBreakdown] = useState([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const teacherId = selectedTeacher || null;
        
        const [summaryRes, trendsRes, gradeRes, subjectRes] = await Promise.all([
          dashboardApi.getSummary(teacherId),
          dashboardApi.getWeeklyTrends(teacherId),
          dashboardApi.getGradeBreakdown(teacherId),
          dashboardApi.getSubjectBreakdown(teacherId)
        ]);
        
        setSummary(summaryRes.data);
        setWeeklyTrends(trendsRes.data);
        setGradeBreakdown(gradeRes.data);
        setSubjectBreakdown(subjectRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTeacher]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Principal Dashboard</h1>
      
      <TeacherFilter 
        selectedTeacher={selectedTeacher} 
        onTeacherChange={setSelectedTeacher} 
      />
      
      <SummaryCards summary={summary} />
      
      <div className="charts-grid">
        <div className="chart-wrapper large">
          <WeeklyTrendsChart data={weeklyTrends} />
        </div>
        
        <div className="chart-wrapper">
          <ActivityTypeChart summary={summary} />
        </div>
        
        <div className="chart-wrapper">
          <GradeChart data={gradeBreakdown} />
        </div>
        
        <div className="chart-wrapper">
          <SubjectChart data={subjectBreakdown} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
