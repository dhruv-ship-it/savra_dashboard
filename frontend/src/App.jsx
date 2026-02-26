import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TeacherDetail from './pages/TeacherDetail';
import RecentActivities from './pages/RecentActivities';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="nav-brand">Principal Dashboard</Link>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/activities">Recent Activities</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teachers/:id" element={<TeacherDetail />} />
            <Route path="/activities" element={<RecentActivities />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
