using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.DTOs;
using SchoolManagement.Data;
using SchoolManagement.API.Models;

namespace SchoolManagement.Services
{
    public sealed class TeacherService(SchoolDbContext context)
    {
        public List<TeacherAssignmentDto> GetMyAssignments(int teacherId)
            => [.. context.TeacherAssignments
                .Where(ta => ta.TeacherId == teacherId)
                .Select(ta => new TeacherAssignmentDto(ta.Id, ta.TeacherId, ta.ClassId, ta.SubjectId, ta.classes.Name, ta.subjects.Name))];

        public bool IsAssignedToClassSubject(int teacherId, int classId, int subjectId)
            => context.TeacherAssignments.Any(ta =>
                ta.TeacherId == teacherId && ta.ClassId == classId && ta.SubjectId == subjectId);

        public void CreateStudent(int teacherId, int classId, string studentName, string? rollNumber)
        {
            var isAssigned = context.TeacherAssignments.Any(ta =>
                ta.TeacherId == teacherId && ta.ClassId == classId);
            if (!isAssigned) return;

            context.Students.Add(new Student
            {
                Name = studentName,
                RollNumber = rollNumber,
                ClassId = classId
            });
            context.SaveChanges();
        }

        public List<StudentDto> GetStudentsForClass(int teacherId, int classId)
        {
            var isAssigned = context.TeacherAssignments.Any(ta =>
                ta.TeacherId == teacherId && ta.ClassId == classId);
            if (!isAssigned) return [];

            return [.. context.Students
                .Where(s => s.ClassId == classId)
                .Include(s => s.grades)
                .Include(s => s.subjects)
                .Select(s => new StudentDto(
                    s.Id, s.Name, s.RollNumber, s.ClassId, s.classes.Name,
                    s.grades.Select(g => new GradeDto(g.Id, g.StudentId, g.SubjectId, g.Term, g.ObtainMarks, g.TotalMarks, g.GradeLetter)).ToList(),
                    s.subjects.Select(sub => new SubjectDto(sub.Id, sub.Name, sub.Description)).ToList()
                ))];
        }

        private Student? GetStudentById(int studentId)
            => context.Students.FirstOrDefault(s => s.Id == studentId);

        public void UpdateStudent(int teacherId, int studentId, string studentName, string? rollNumber)
        {
            var student = GetStudentById(studentId);
            if (student is null) return;

            var isAssigned = context.TeacherAssignments.Any(ta =>
                ta.TeacherId == teacherId && ta.ClassId == student.ClassId);
            if (!isAssigned) return;

            student.Name = studentName;
            student.RollNumber = rollNumber;
            context.SaveChanges();
        }

        public void DeleteStudent(int teacherId, int studentId)
        {
            var student = GetStudentById(studentId);
            if (student is null) return;

            var isAssigned = context.TeacherAssignments.Any(ta =>
                ta.TeacherId == teacherId && ta.ClassId == student.ClassId);
            if (!isAssigned) return;

            context.Students.Remove(student);
            context.SaveChanges();
        }

        public void AssignGrade(int teacherId, int studentId, int subjectId, string term, decimal marksObtained, decimal totalMarks)
        {
            var student = GetStudentById(studentId);
            if (student is null) return;

            var isAssigned = IsAssignedToClassSubject(teacherId, student.ClassId, subjectId);
            if (!isAssigned) return;

            var existingGrade = context.Grades.FirstOrDefault(g =>
                g.StudentId == studentId && g.SubjectId == subjectId && g.Term == term);

            if (existingGrade is not null)
            {
                existingGrade.ObtainMarks = marksObtained;
                existingGrade.TotalMarks = totalMarks;
                existingGrade.GradeLetter = CalculateGradeLetter(marksObtained, totalMarks);
            }
            else
            {
                context.Grades.Add(new Grade
                {
                    StudentId = studentId,
                    SubjectId = subjectId,
                    Term = term,
                    ObtainMarks = marksObtained,
                    TotalMarks = totalMarks,
                    GradeLetter = CalculateGradeLetter(marksObtained, totalMarks)
                });
            }
            context.SaveChanges();
        }

        public List<GradeDto> GetStudentGrades(int teacherId, int studentId)
        {
            var student = GetStudentById(studentId);
            if (student is null) return [];

            var isAssigned = context.TeacherAssignments.Any(ta =>
                ta.TeacherId == teacherId && ta.ClassId == student.ClassId);
            if (!isAssigned) return [];

            return [.. context.Grades
                .Where(g => g.StudentId == studentId)
                .OrderBy(g => g.Term)
                .Select(g => new GradeDto(g.Id, g.StudentId, g.SubjectId, g.Term, g.ObtainMarks, g.TotalMarks, g.GradeLetter))];
        }

        private static string CalculateGradeLetter(decimal marksObtained, decimal totalMarks)
        {
            if (totalMarks == 0) return "F";
            decimal percentage = marksObtained / totalMarks * 100;
            return percentage switch
            {
                >= 90 => "A+",
                >= 80 => "A",
                >= 70 => "B",
                >= 60 => "C",
                >= 50 => "D",
                _ => "F"
            };
        }


        public List<StudentGradesDto> GetClassGrades(int teacherId, int classId, int subjectId)
        {
            var isAssigned = IsAssignedToClassSubject(teacherId, classId, subjectId);
            if (!isAssigned) return [];

            return [.. context.Students
        .Where(s => s.ClassId == classId)
        .Include(s => s.grades.Where(g => g.SubjectId == subjectId))
        .Select(s => new StudentGradesDto(
            s.Id,
            s.Name,
            s.grades.Where(g => g.Term == "1st Term").Select(g => new GradeDto(g.Id, g.StudentId, g.SubjectId, g.Term, g.ObtainMarks, g.TotalMarks, g.GradeLetter)).FirstOrDefault(),
            s.grades.Where(g => g.Term == "Mid Term").Select(g => new GradeDto(g.Id, g.StudentId, g.SubjectId, g.Term, g.ObtainMarks, g.TotalMarks, g.GradeLetter)).FirstOrDefault(),
            s.grades.Where(g => g.Term == "Final Term").Select(g => new GradeDto(g.Id, g.StudentId, g.SubjectId, g.Term, g.ObtainMarks, g.TotalMarks, g.GradeLetter)).FirstOrDefault(),
            s.grades.Any() ? $"{s.grades.Sum(g => g.ObtainMarks) / s.grades.Sum(g => g.TotalMarks) * 100:F2}%" : "N/A"
        ))];
        }
    }
}