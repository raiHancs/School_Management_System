import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentManagement from '../components/StudentManagement';
import GradeManagement from '../components/GradeManagement';
import MyAssignments from '../components/MyAssignments';
import './Dashboard.css';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.fullName || user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'assignments' ? 'active' : ''}
          onClick={() => setActiveTab('assignments')}
        >
          My Assignments
        </button>
        <button
          className={activeTab === 'students' ? 'active' : ''}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button
          className={activeTab === 'grades' ? 'active' : ''}
          onClick={() => setActiveTab('grades')}
        >
          Grades
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'assignments' && <MyAssignments />}
        {activeTab === 'students' && <StudentManagement />}
        {activeTab === 'grades' && <GradeManagement />}
      </div>
    </div>
  );
};

export default TeacherDashboard;