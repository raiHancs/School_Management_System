import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import './Management.css';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    className: '',
    description: '',
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await adminAPI.getClasses();
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await adminAPI.updateClass(editingClass.classId, formData);
        alert('Class updated successfully!');
      } else {
        await adminAPI.createClass(formData);
        alert('Class created successfully!');
      }
      setShowModal(false);
      setEditingClass(null);
      setFormData({ className: '', description: '' });
      fetchClasses();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Operation failed'));
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      className: classItem.className,
      description: classItem.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await adminAPI.deleteClass(id);
        alert('Class deleted successfully!');
        fetchClasses();
      } catch (error) {
        alert('Error deleting class');
      }
    }
  };

  const openCreateModal = () => {
    setEditingClass(null);
    setFormData({ className: '', description: '' });
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Class Management</h2>
        <button onClick={openCreateModal} className="btn-primary">
          + Add Class
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Class Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.classId}>
              <td>{classItem.id}</td>
              <td>{classItem.name}</td>
              <td>{classItem.description || '-'}</td>
              <td>
                <button
                  onClick={() => handleEdit(classItem)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(classItem.classId)}
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
            <h3>{editingClass ? 'Edit Class' : 'Create Class'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) =>
                    setFormData({ ...formData, className: e.target.value })
                  }
                  required
                  placeholder="e.g., Grade 5"
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter class description"
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingClass ? 'Update' : 'Create'}
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

export default ClassManagement;