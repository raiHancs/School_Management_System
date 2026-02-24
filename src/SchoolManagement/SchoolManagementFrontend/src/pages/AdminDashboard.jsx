import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TeacherManagement from '../components/TeacherManagement';
import ClassManagement from '../components/ClassManagement';
import SubjectManagement from '../components/SubjectManagement';
import AssignmentManagement from '../components/AssignmentManagement';
import './Dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.Email || user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'teachers' ? 'active' : ''}
          onClick={() => setActiveTab('teachers')}
        >
          Teachers
        </button>
        <button
          className={activeTab === 'classes' ? 'active' : ''}
          onClick={() => setActiveTab('classes')}
        >
          Classes
        </button>
        <button
          className={activeTab === 'subjects' ? 'active' : ''}
          onClick={() => setActiveTab('subjects')}
        >
          Subjects
        </button>
        <button
          className={activeTab === 'assignments' ? 'active' : ''}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'teachers' && <TeacherManagement />}
        {activeTab === 'classes' && <ClassManagement />}
        {activeTab === 'subjects' && <SubjectManagement />}
        {activeTab === 'assignments' && <AssignmentManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;