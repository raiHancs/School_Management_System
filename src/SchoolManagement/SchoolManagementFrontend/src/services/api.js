import axios from 'axios';

// ⚠️ CHANGE THIS PORT TO YOUR API PORT!
const API_BASE_URL = 'https://localhost:7000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/Auth/login', { username, password }),
};

// Admin API
export const adminAPI = {
  // Teachers
  getTeachers: () => api.get('/Admin/teachers'),
  getTeacher: (id) => api.get(`/Admin/teachers/${id}`),
  createTeacher: (data) => api.post('/Admin/teachers', data),
  updateTeacher: (id, data) => api.put(`/Admin/teachers/${id}`, data),
  deleteTeacher: (id) => api.delete(`/Admin/teachers/${id}`),

  // Classes
  getClasses: () => api.get('/Admin/classes'),
  createClass: (data) => api.post('/Admin/classes', data),
  updateClass: (id, data) => api.put(`/Admin/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/Admin/classes/${id}`),

  // Subjects
  getSubjects: () => api.get('/Admin/subjects'),
  createSubject: (data) => api.post('/Admin/subjects', data),
  updateSubject: (id, data) => api.put(`/Admin/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/Admin/subjects/${id}`),

  // Assignments
  assignSubjectToClass: (data) =>
    api.post('/Admin/assign-subject-to-class', data),
  getClassSubjects: (classId) =>
    api.get(`/Admin/classes/${classId}/subjects`),
  assignTeacher: (data) => api.post('/Admin/assign-teacher', data),
  getTeacherAssignments: (teacherId) =>
    api.get(`/Admin/teachers/${teacherId}/assignments`),
};

// Teacher API
export const teacherAPI = {
  getAssignments: (teacherId) =>
    api.get(`/Teacher/${teacherId}/assignments`),
  getStudents: (teacherId, classId) =>
    api.get(`/Teacher/${teacherId}/classes/${classId}/students`),
  createStudent: (teacherId, data) =>
    api.post(`/Teacher/${teacherId}/students`, data),
  updateStudent: (teacherId, studentId, data) =>
    api.put(`/Teacher/${teacherId}/students/${studentId}`, data),
  deleteStudent: (teacherId, studentId) =>
    api.delete(`/Teacher/${teacherId}/students/${studentId}`),
  assignGrade: (teacherId, data) =>
    api.post(`/Teacher/${teacherId}/grades`, data),
  getStudentGrades: (teacherId, studentId) =>
    api.get(`/Teacher/${teacherId}/students/${studentId}/grades`),
};

export default api;