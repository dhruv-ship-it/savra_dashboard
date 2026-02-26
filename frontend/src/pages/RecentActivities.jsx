import { useState, useEffect } from 'react';
import { activityApi } from '../services/api';

function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalCount: 0,
    limit: 10
  });

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await activityApi.getActivities(page, 10);
        setActivities(response.data.activities);
        setPagination(response.data.pagination);
      } catch (err) {
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="recent-activities-page">
      <h1>Recent Activities</h1>
      
      <div className="table-container">
        <table className="activities-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Teacher</th>
              <th>Type</th>
              <th>Grade</th>
              <th>Subject</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.id}</td>
                <td>{activity.teacherName}</td>
                <td>{activity.activityType}</td>
                <td>Grade {activity.grade}</td>
                <td>{activity.subject}</td>
                <td>{new Date(activity.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          onClick={handlePrevPage} 
          disabled={page === 1 || loading}
          className="pagination-btn"
        >
          Previous
        </button>
        
        <span className="pagination-info">
          Page {page} of {pagination.totalPages} 
          ({pagination.totalCount} total activities)
        </span>
        
        <button 
          onClick={handleNextPage} 
          disabled={page === pagination.totalPages || loading}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RecentActivities;
