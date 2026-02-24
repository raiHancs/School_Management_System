import React, { useState, useEffect, useCallback } from 'react';
import { teacherAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Management.css';

const StudentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
  });
  const { user } = useAuth();

  const fetchAssignments = useCallback(async () => {
  try {
    const response = await teacherAPI.getAssignments(user.userId);
    setAssignments(response.data);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    setAssignments([]);
  } finally {
    setLoading(false); 
  }
}, [user.userId]);

const fetchStudents = useCallback(async () => {
  try {
    const response = await teacherAPI.getStudents(user.userId, selectedClassId);
    console.log('First student:', JSON.stringify(response.data[0]));
    setStudents(response.data);
  } catch (error) {
    console.error('Error fetching students:', error);
    setStudents([]);
  } finally {
    setLoading(false); 
  }
}, [user.userId, selectedClassId]);


// Assignments effect
useEffect(() => {
  const loadAssignments = async () => {
    await fetchAssignments();
  };
  loadAssignments();
}, [fetchAssignments]);

// Students effect
useEffect(() => {
  if (selectedClassId) {
    const loadStudents = async () => {
      await fetchStudents();
    };
    loadStudents();
  }
}, [selectedClassId, fetchStudents]);

    

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await teacherAPI.updateStudent(user.userId, editingStudent.studentId, formData);
        alert('Student updated successfully!');
      } else {
        await teacherAPI.createStudent(user.userId, {
          classId: parseInt(selectedClassId),
          ...formData,
        });
        alert('Student created successfully!');
      }
      setShowModal(false);
      setEditingStudent(null);
      setFormData({ studentName: '', rollNumber: '' });
      fetchStudents();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Operation failed'));
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      studentName: student.studentName,
      rollNumber: student.rollNumber || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await teacherAPI.deleteStudent(user.userId, studentId);
        alert('Student deleted successfully!');
        fetchStudents();
      } catch (error) {
        alert('Error deleting student');
      }
    }
  };

  const openCreateModal = () => {
    if (!selectedClassId) {
      alert('Please select a class first!');
      return;
    }
    setEditingStudent(null);
    setFormData({ studentName: '', rollNumber: '' });
    setShowModal(true);
  };

  // Get unique classes from assignments
  const classes = assignments.filter(
  (v, i, a) => a.findIndex((t) => t.classId === v.classId) === i);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Student Management</h2>
        <button onClick={openCreateModal} className="btn-primary">
          + Add Student
        </button>
      </div>

      <div className="form-group" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
        <label>Select Class</label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          <option value="">-- Select a Class --</option>
          {classes.map((cls) => (
            <option key={cls.classId} value={cls.classId}>
              {cls.className}
            </option>
          ))}
        </select>
      </div>

      {selectedClassId ? (
        students.length === 0 ? (
          <div className="no-data">
            <p>No students found in this class.</p>
            <p>Click "Add Student" to create a new student.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.id}</td>
                  <td>{student.rollNumber || '-'}</td>
                  <td>{student.name}</td>
                  <td>{student.className}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(student)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.studentId)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : (
        <div className="no-data">
          <p>Please select a class to view students.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingStudent ? 'Edit Student' : 'Create Student'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Student Name</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  required
                  placeholder="Enter student name"
                />
              </div>

              <div className="form-group">
                <label>Roll Number (Optional)</label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNumber: e.target.value })
                  }
                  placeholder="Enter roll number"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingStudent ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;