import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';
import TeacherFilter from '../components/TeacherFilter';
import PeriodFilter from '../components/PeriodFilter';
import SummaryCards from '../components/SummaryCards';
import WeeklyTrendsChart from '../components/WeeklyTrendsChart';
import ActivityTypeChart from '../components/ActivityTypeChart';
import GradeChart from '../components/GradeChart';
import SubjectChart from '../components/SubjectChart';

function Dashboard() {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
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
        const period = selectedPeriod === 'all' ? null : selectedPeriod;
        let periodValue = null;
        
        if (selectedPeriod === 'weekly') periodValue = selectedWeek;
        else if (selectedPeriod === 'monthly') periodValue = selectedMonth;
        else if (selectedPeriod === 'yearly') periodValue = selectedYear;
        
        const [summaryRes, trendsRes, gradeRes, subjectRes] = await Promise.all([
          dashboardApi.getSummary(teacherId, period, periodValue),
          dashboardApi.getWeeklyTrends(teacherId, period, periodValue),
          dashboardApi.getGradeBreakdown(teacherId, period, periodValue),
          dashboardApi.getSubjectBreakdown(teacherId, period, periodValue)
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
  }, [selectedTeacher, selectedPeriod, selectedWeek, selectedMonth, selectedYear]);

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
      <TeacherFilter 
        selectedTeacher={selectedTeacher} 
        onTeacherChange={setSelectedTeacher} 
      />
      
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
