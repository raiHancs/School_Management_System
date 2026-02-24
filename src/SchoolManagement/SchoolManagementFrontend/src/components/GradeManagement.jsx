import React, { useState, useEffect, useCallback } from 'react';
import { teacherAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Management.css';

const GradeManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentGrades, setStudentGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    term: '1st Term',
    marksObtained: '',
    totalMarks: '',
  });
  const { user } = useAuth();

  const fetchAssignments = useCallback(async () => {
    try {
      const response = await teacherAPI.getAssignments(user.userId);
      setAssignments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setLoading(false);
    }
  }, [user.userId]);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await teacherAPI.getStudents(user.userId, selectedClassId);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  }, [user.userId, selectedClassId]);

  const fetchStudentGrades = useCallback(async (studentId) => {
    try {
      const response = await teacherAPI.getStudentGrades(user.userId, studentId);
      setStudentGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setStudentGrades([]);
    }
  }, [user.userId]);

  useEffect(() => {
  const loadAssignments = async () => {
    await fetchAssignments();
  };
  loadAssignments();
}, [fetchAssignments]);


  useEffect(() => {
  if (selectedClassId) {
    const loadStudents = async () => {
      await fetchStudents();
    };
    loadStudents();
  }
}, [selectedClassId, fetchStudents]);


  const handleAssignGrade = async (e) => {
    e.preventDefault();

    if (!selectedSubjectId) {
      alert('Please select a subject!');
      return;
    }

    try {
      await teacherAPI.assignGrade(user.userId, {
        studentId: selectedStudent.studentId,
        subjectId: parseInt(selectedSubjectId),
        term: gradeForm.term,
        marksObtained: parseFloat(gradeForm.marksObtained),
        totalMarks: parseFloat(gradeForm.totalMarks),
      });
      alert('Grade assigned successfully!');
      setShowModal(false);
      setGradeForm({ term: '1st Term', marksObtained: '', totalMarks: '' });
      fetchStudentGrades(selectedStudent.studentId);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to assign grade'));
    }
  };

  const openGradeModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
    fetchStudentGrades(student.studentId);
  };

  const classes = assignments.filter(
    (v, i, a) => a.findIndex((t) => t.classId === v.classId) === i);

  const availableSubjects = assignments.filter(
    (a) => a.classId === parseInt(selectedClassId));

  if (loading) return <div className="loading">Loading...</div>;

  const selectedSubjectName = availableSubjects.find(
  (a) => a.subjectId === parseInt(selectedSubjectId))?.subjectName || '-';
  console.log('Available subjects for selected class:', availableSubjects);

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Grade Management</h2>
      </div>

      <div className="filters" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Select Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedSubjectId('');
            }}
          >
            <option value="">-- Select a Class --</option>
            {classes.map((cls) => (
              <option key={cls.classId} value={cls.classId}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>

        {selectedClassId && (
          <div className="form-group" style={{ flex: 1 }}>
            <label>Select Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              <option value="">-- Select a Subject --</option>
              {availableSubjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedClassId && selectedSubjectId ? (
        students.length === 0 ? (
          <div className="no-data">
            <p>No students found in this class.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.rollNumber || '-'}</td>
                  <td>{student.name}</td>
                  <td>
                    <button onClick={() => openGradeModal(student)} className="btn-primary">
                      Manage Grades
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : (
        <div className="no-data">
          <p>Please select both class and subject to manage grades.</p>
        </div>
      )}

      {showModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>Manage Grades - {selectedStudent.studentName}</h3>

            {studentGrades.length > 0 && (
              <div className="grades-list">
                <h4>Current Grades</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Term</th>
                      <th>Marks</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentGrades
                      .filter((g) => g.subjectId === parseInt(selectedSubjectId))
                      .map((grade) => (
                        <tr key={grade.gradeId}>
                          <td>{selectedSubjectName}</td>
                          <td>{grade.term}</td>
                          <td>{grade.marksObtained} / {grade.totalMarks}</td>
                          <td>
                            <span className={`grade-badge grade-${grade.gradeLetter}`}>
                              {grade.gradeLetter}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="assign-grade-form">
              <h4>Assign Grade</h4>
              <form onSubmit={handleAssignGrade}>
                <div className="form-group">
                  <label>Term</label>
                  <select
                    value={gradeForm.term}
                    onChange={(e) => setGradeForm({ ...gradeForm, term: e.target.value })}
                    required
                  >
                    <option value="1st Term">1st Term</option>
                    <option value="Mid Term">Mid Term</option>
                    <option value="Final Term">Final Term</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Marks Obtained</label>
                  <input
                    type="number"
                    step="0.01"
                    value={gradeForm.marksObtained}
                    onChange={(e) => setGradeForm({ ...gradeForm, marksObtained: e.target.value })}
                    required
                    placeholder="e.g., 85"
                  />
                </div>

                <div className="form-group">
                  <label>Total Marks</label>
                  <input
                    type="number"
                    step="0.01"
                    value={gradeForm.totalMarks}
                    onChange={(e) => setGradeForm({ ...gradeForm, totalMarks: e.target.value })}
                    required
                    placeholder="e.g., 100"
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn-primary">Assign Grade</button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeManagement;