import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import './Management.css';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.getTeachers();
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await adminAPI.updateTeacher(editingTeacher.userId, formData);
        alert('Teacher updated successfully!');
      } else {
        await adminAPI.createTeacher(formData);
        alert('Teacher created successfully!');
      }
      setShowModal(false);
      setEditingTeacher(null);
      setFormData({ username: '', password: '', fullName: '' });
      fetchTeachers();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Operation failed'));
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      username: teacher.username,
      password: '',
      fullName: teacher.fullName,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await adminAPI.deleteTeacher(id);
        alert('Teacher deleted successfully!');
        fetchTeachers();
      } catch (error) {
        alert('Error deleting teacher');
      }
    }
  };

  const openCreateModal = () => {
    setEditingTeacher(null);
    setFormData({ username: '', password: '', fullName: '' });
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Teacher Management</h2>
        <button onClick={openCreateModal} className="btn-primary">
          + Add Teacher
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>E-mail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.userId}>
              <td>{teacher.id}</td>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>
              <td>
                <button
                  onClick={() => handleEdit(teacher)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(teacher.userId)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingTeacher ? 'Edit Teacher' : 'Create Teacher'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required={!editingTeacher}
                  placeholder={editingTeacher ? 'Leave blank to keep current' : ''}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingTeacher ? 'Update' : 'Create'}
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

export default TeacherManagement;