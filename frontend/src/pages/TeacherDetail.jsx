import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { teacherApi, dashboardApi } from '../services/api';
import PeriodFilter from '../components/PeriodFilter';
import SummaryCards from '../components/SummaryCards';
import WeeklyTrendsChart from '../components/WeeklyTrendsChart';
import ActivityTypeChart from '../components/ActivityTypeChart';
import GradeChart from '../components/GradeChart';
import SubjectChart from '../components/SubjectChart';

function TeacherDetail() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const period = selectedPeriod === 'all' ? null : selectedPeriod;
        let periodValue = null;
        
        if (selectedPeriod === 'weekly') periodValue = selectedWeek;
        else if (selectedPeriod === 'monthly') periodValue = selectedMonth;
        else if (selectedPeriod === 'yearly') periodValue = selectedYear;
        
        const [teacherResponse, trendsResponse] = await Promise.all([
          teacherApi.getTeacherById(id),
          dashboardApi.getWeeklyTrends(id, period, periodValue)
        ]);
        
        setTeacher(teacherResponse.data);
        setWeeklyTrends(trendsResponse.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Teacher not found');
        } else {
          setError('Failed to load teacher details');
        }
        console.error('Teacher detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id, selectedPeriod, selectedWeek, selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="teacher-detail">
        <div className="loading">Loading teacher details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-detail">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="teacher-detail">
        <div className="error">Teacher not found</div>
      </div>
    );
  }

  return (
    <div className="teacher-detail">
      <h1>{teacher.name}</h1>
      <p className="teacher-id">ID: {teacher.id}</p>
      
      <PeriodFilter 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      
      <SummaryCards summary={teacher.summary} />
      
      <div className="charts-grid">
        <div className="chart-wrapper large">
          <WeeklyTrendsChart data={weeklyTrends} />
        </div>
        
        <div className="chart-wrapper">
          <ActivityTypeChart summary={teacher.summary} />
        </div>
        
        <div className="chart-wrapper">
          <GradeChart data={teacher.gradeBreakdown} />
        </div>
        
        <div className="chart-wrapper">
          <SubjectChart data={teacher.subjectBreakdown} />
        </div>
      </div>
      
      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <table className="activities-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Grade</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {teacher.recentActivities.map((activity) => (
              <tr key={activity.id}>
                <td>{new Date(activity.createdAt).toLocaleDateString()}</td>
                <td>{activity.activityType}</td>
                <td>Grade {activity.grade}</td>
                <td>{activity.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeacherDetail;
