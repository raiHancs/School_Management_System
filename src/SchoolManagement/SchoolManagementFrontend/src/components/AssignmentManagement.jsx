import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import './Management.css';

const AssignmentManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSubjects, setClassSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assign-subject');

  const [assignSubjectForm, setAssignSubjectForm] = useState({
    classId: '',
    subjectId: '',
  });

  const [assignTeacherForm, setAssignTeacherForm] = useState({
    teacherId: '',
    classId: '',
    subjectId: '',
  });

  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (assignTeacherForm.classId) {
      fetchClassSubjects(assignTeacherForm.classId);
    }
  }, [assignTeacherForm.classId]);

  useEffect(() => {
    if (selectedTeacherId) {
      fetchTeacherAssignments(selectedTeacherId);
    }
  }, [selectedTeacherId]);

  const fetchData = async () => {
    try {
      const [teachersRes, classesRes, subjectsRes] = await Promise.all([
        adminAPI.getTeachers(),
        adminAPI.getClasses(),
        adminAPI.getSubjects(),
      ]);
      setTeachers(teachersRes.data);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassSubjects = async (classId) => {
    try {
      const response = await adminAPI.getClassSubjects(classId);
      setClassSubjects(response.data);
    } catch (error) {
      console.error('Error fetching class subjects:', error);
      setClassSubjects([]);
    }
  };

  const fetchTeacherAssignments = async (teacherId) => {
    try {
      const response = await adminAPI.getTeacherAssignments(teacherId);
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setAssignments([]);
    }
  };

  const handleAssignSubject = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.assignSubjectToClass(assignSubjectForm);
      alert('Subject assigned to class successfully!');
      setAssignSubjectForm({ classId: '', subjectId: '' });
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Assignment failed'));
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.assignTeacher(assignTeacherForm);
      alert('Teacher assigned successfully!');
      setAssignTeacherForm({ teacherId: '', classId: '', subjectId: '' });
      setClassSubjects([]);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Assignment failed'));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="management-container">
      <div className="assignment-tabs">
        <button
          className={activeTab === 'assign-subject' ? 'active' : ''}
          onClick={() => setActiveTab('assign-subject')}
        >
          Assign Subject to Class
        </button>
        <button
          className={activeTab === 'assign-teacher' ? 'active' : ''}
          onClick={() => setActiveTab('assign-teacher')}
        >
          Assign Teacher
        </button>
        <button
          className={activeTab === 'view-assignments' ? 'active' : ''}
          onClick={() => setActiveTab('view-assignments')}
        >
          View Assignments
        </button>
      </div>

      {activeTab === 'assign-subject' && (
        <div className="assignment-section">
          <h3>Assign Subject to Class</h3>
          <form onSubmit={handleAssignSubject} className="assignment-form">
            <div className="form-group">
              <label>Select Class</label>
              <select
                value={assignSubjectForm.classId}
                onChange={(e) =>
                  setAssignSubjectForm({
                    ...assignSubjectForm,
                    classId: e.target.value,
                  })
                }
                required
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Subject</label>
              <select
                value={assignSubjectForm.subjectId}
                onChange={(e) =>
                  setAssignSubjectForm({
                    ...assignSubjectForm,
                    subjectId: e.target.value,
                  })
                }
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary">
              Assign Subject
            </button>
          </form>
        </div>
      )}

      {activeTab === 'assign-teacher' && (
        <div className="assignment-section">
          <h3>Assign Teacher to Class & Subject</h3>
          <form onSubmit={handleAssignTeacher} className="assignment-form">
            <div className="form-group">
              <label>Select Teacher</label>
              <select
                value={assignTeacherForm.teacherId}
                onChange={(e) =>
                  setAssignTeacherForm({
                    ...assignTeacherForm,
                    teacherId: e.target.value,
                  })
                }
                required
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.email} ({teacher.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Class</label>
              <select
                value={assignTeacherForm.classId}
                onChange={(e) =>
                  setAssignTeacherForm({
                    ...assignTeacherForm,
                    classId: e.target.value,
                    subjectId: '',
                  })
                }
                required
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {assignTeacherForm.classId && (
              <div className="form-group">
                <label>Select Subject</label>
                <select
                  value={assignTeacherForm.subjectId}
                  onChange={(e) =>
                    setAssignTeacherForm({
                      ...assignTeacherForm,
                      subjectId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">-- Select Subject --</option>
                  {classSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {classSubjects.length === 0 && (
                  <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    No subjects assigned to this class yet!
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={classSubjects.length === 0}
            >
              Assign Teacher
            </button>
          </form>
        </div>
      )}

      {activeTab === 'view-assignments' && (
        <div className="assignment-section">
          <h3>View Teacher Assignments</h3>
          <div className="form-group">
            <label>Select Teacher</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
            >
              <option value="">-- Select Teacher --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.email} ({teacher.name})
                </option>
              ))}
            </select>
          </div>

          {selectedTeacherId && (
            <div style={{ marginTop: '2rem' }}>
              {assignments.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                  No assignments found for this teacher.
                </p>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;