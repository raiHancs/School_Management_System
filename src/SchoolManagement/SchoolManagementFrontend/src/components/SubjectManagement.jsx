import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import './Management.css';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: '',
    description: '',
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await adminAPI.getSubjects();
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await adminAPI.updateSubject(editingSubject.subjectId, formData);
        alert('Subject updated successfully!');
      } else {
        await adminAPI.createSubject(formData);
        alert('Subject created successfully!');
      }
      setShowModal(false);
      setEditingSubject(null);
      setFormData({ subjectName: '', description: '' });
      fetchSubjects();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Operation failed'));
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      subjectName: subject.subjectName,
      description: subject.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await adminAPI.deleteSubject(id);
        alert('Subject deleted successfully!');
        fetchSubjects();
      } catch (error) {
        alert('Error deleting subject');
      }
    }
  };

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormData({ subjectName: '', description: '' });
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Subject Management</h2>
        <button onClick={openCreateModal} className="btn-primary">
          + Add Subject
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.subjectId}>
              <td>{subject.id}</td>
              <td>{subject.name}</td>
              <td>{subject.description || '-'}</td>
              <td>
                <button
                  onClick={() => handleEdit(subject)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(subject.subjectId)}
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
            <h3>{editingSubject ? 'Edit Subject' : 'Create Subject'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  value={formData.subjectName}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectName: e.target.value })
                  }
                  required
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter subject description"
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingSubject ? 'Update' : 'Create'}
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

export default SubjectManagement;