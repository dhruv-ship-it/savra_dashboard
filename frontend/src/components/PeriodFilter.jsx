import { useState, useEffect } from 'react';

function PeriodFilter({ selectedPeriod, onPeriodChange, selectedWeek, onWeekChange, selectedMonth, onMonthChange, selectedYear, onYearChange }) {
  const [currentWeek, setCurrentWeek] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    const now = new Date();
    
    // Get current week in YYYY-WXX format
    const weekNumber = getWeekNumber(now);
    const year = now.getFullYear();
    setCurrentWeek(`${year}-W${weekNumber.toString().padStart(2, '0')}`);
    
    // Get current month in YYYY-MM format
    setCurrentMonth(`${year}-${(now.getMonth() + 1).toString().padStart(2, '0')}`);
    
    // Get current year
    setCurrentYear(year.toString());
  }, []);

  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  }

  const generateWeekOptions = () => {
    const options = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Generate last 52 weeks
    for (let i = 0; i < 52; i++) {
      const weekDate = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      const weekNumber = getWeekNumber(weekDate);
      const year = weekDate.getFullYear();
      const weekString = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
      options.push(weekString);
    }
    
    return options;
  };

  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    // Generate last 24 months
    for (let i = 0; i < 24; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = monthDate.getFullYear();
      const month = (monthDate.getMonth() + 1).toString().padStart(2, '0');
      options.push(`${year}-${month}`);
    }
    
    return options;
  };

  const generateYearOptions = () => {
    const options = [];
    const currentYear = new Date().getFullYear();
    
    // Generate last 10 years
    for (let i = 0; i < 10; i++) {
      options.push((currentYear - i).toString());
    }
    
    return options;
  };

  return (
    <div className="period-filter">
      <div className="period-type-selector">
        <label htmlFor="period-select">Filter by Period: </label>
        <select
          id="period-select"
          value={selectedPeriod}
          onChange={(e) => onPeriodChange(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="weekly">Week</option>
          <option value="monthly">Month</option>
          <option value="yearly">Year</option>
        </select>
      </div>

      {selectedPeriod === 'weekly' && (
        <div className="period-value-selector">
          <label htmlFor="week-select">Select Week: </label>
          <select
            id="week-select"
            value={selectedWeek}
            onChange={(e) => onWeekChange(e.target.value)}
          >
            <option value="">Select Week</option>
            {generateWeekOptions().map((week) => (
              <option key={week} value={week}>
                {week} {week === currentWeek ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedPeriod === 'monthly' && (
        <div className="period-value-selector">
          <label htmlFor="month-select">Select Month: </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
          >
            <option value="">Select Month</option>
            {generateMonthOptions().map((month) => (
              <option key={month} value={month}>
                {month} {month === currentMonth ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedPeriod === 'yearly' && (
        <div className="period-value-selector">
          <label htmlFor="year-select">Select Year: </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <option value="">Select Year</option>
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year} {year === currentYear ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default PeriodFilter;
