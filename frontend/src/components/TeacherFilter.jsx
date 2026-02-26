import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherApi } from '../services/api';

function TeacherFilter({ selectedTeacher, onTeacherChange }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await teacherApi.getAllTeachers();
        setTeachers(response.data);
      } catch (err) {
        setError('Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) return <div>Loading teachers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="teacher-filter">
      <label htmlFor="teacher-select">Filter by Teacher: </label>
      <select
        id="teacher-select"
        value={selectedTeacher}
        onChange={(e) => onTeacherChange(e.target.value)}
      >
        <option value="">All Teachers</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>
      {selectedTeacher && (
        <Link to={`/teachers/${selectedTeacher}`} className="view-teacher-link">
          View Teacher Details
        </Link>
      )}
    </div>
  );
}

export default TeacherFilter;
