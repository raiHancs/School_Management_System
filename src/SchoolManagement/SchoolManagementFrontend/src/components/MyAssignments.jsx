import React, { useState, useEffect, useCallback } from 'react';
import { teacherAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Management.css';

const MyAssignments = () => {
const [assignments, setAssignments] = useState([]);
const [loading, setLoading] = useState(true);
const { user } = useAuth();

  const fetchAssignments = useCallback(async () => {
    try {
        const response = await teacherAPI.getAssignments(user.userId);
        console.log('First assignment:', JSON.stringify(response.data[0]));
        console.log('API response:', response);
        console.log('Data:', response.data);
        setAssignments(response.data);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        setAssignments([]);
    } finally {
        setLoading(false); 
  }
    }, [user.userId]);  


  useEffect(() => {
  const loadAssignments = async () => {
    await fetchAssignments();
  };
  loadAssignments();
}, [fetchAssignments]);
  

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>My Assignments</h2>
      </div>

      {assignments.length === 0 ? (
        <div className="no-data">
          <p>You have no assignments yet.</p>
          <p>Please contact the administrator to get assigned to classes.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.className}</td>
                <td>{assignment.subjectName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="info-box">
        <h3>📚 Your Teaching Responsibilities</h3>
        <p>
          You are currently assigned to {assignments.length} class-subject
          combination(s).
        </p>
        <p>
          You can manage students and assign grades for these assignments using
          the tabs above.
        </p>
      </div>
    </div>
  );
};

export default MyAssignments;