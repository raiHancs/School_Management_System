using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Models;
using SchoolManagement.API.DTOs;
using SchoolManagement.Data;

namespace SchoolManagement.Services
{
    public sealed class AdminService(SchoolDbContext context)
    {
        public void CreateTeacher(string username, string email, string password)
        {
            User teacher = new()
            {
                Name = username,
                Email = email,
                Password = password,
                UserType = User.userType.Teacher
            };
            context.Users.Add(teacher);
            context.SaveChanges();
        }

        public List<UserDto> GetAllTeachers()
            => [.. context.Users
                .Where(u => u.UserType == User.userType.Teacher)
                .Select(u => new UserDto(u.Id, u.Name, u.Email, u.UserType))];

        public UserDto? GetTeacherById(int id)
            => context.Users
                .Where(u => u.Id == id && u.UserType == User.userType.Teacher)
                .Select(u => new UserDto(u.Id, u.Name, u.Email, u.UserType))
                .FirstOrDefault();

        public void UpdateTeacher(int teacherId, string username, string email, string password)
        {
            var teacher = context.Users.FirstOrDefault(u => u.Id == teacherId && u.UserType == User.userType.Teacher);
            if (teacher is not null)
            {
                teacher.Name = username;
                teacher.Email = email;
                teacher.Password = password;
                context.SaveChanges();
            }
        }

        public void DeleteTeacher(int teacherId)
        {
            var teacher = context.Users.FirstOrDefault(u => u.Id == teacherId && u.UserType == User.userType.Teacher);
            if (teacher is not null)
            {
                context.Users.Remove(teacher);
                context.SaveChanges();
            }
        }

        public void CreateClass(string className, string? description)
        {
            Class classEntity = new() { Name = className, Description = description };
            context.Classes.Add(classEntity);
            context.SaveChanges();
        }

        public List<ClassDto> GetAllClasses()
            => [.. context.Classes
                .Include(c => c.classSubjects)
                .Include(c => c.students).ThenInclude(s => s.grades)
                .Include(c => c.students).ThenInclude(s => s.subjects)
                .Include(c => c.teacherAssignments)
                .Select(c => new ClassDto(
                    c.Id,
                    c.Name,
                    c.Description,
                    c.classSubjects.Select(cs => new ClassSubjectDto(cs.Id, cs.ClassId, cs.SubjectId)).ToList(),
                    c.students.Select(s => new StudentDto(
                        s.Id, s.Name, s.RollNumber, s.ClassId, s.classes.Name,
                        s.grades.Select(g => new GradeDto(g.Id, g.StudentId, g.SubjectId, g.Term, g.ObtainMarks, g.TotalMarks, g.GradeLetter)).ToList(),
                        s.subjects.Select(sub => new SubjectDto(sub.Id, sub.Name, sub.Description)).ToList()
                    )).ToList(),
                    c.teacherAssignments.Select(ta => new TeacherAssignmentDto(ta.Id, ta.TeacherId, ta.ClassId, ta.SubjectId, ta.classes.Name, ta.subjects.Name)).ToList()
                ))];

        public void UpdateClass(int classId, string className, string? description)
        {
            var classEntity = context.Classes.FirstOrDefault(c => c.Id == classId);
            if (classEntity is not null)
            {
                classEntity.Name = className;
                classEntity.Description = description;
                context.SaveChanges();
            }
        }

        public void DeleteClass(int classId)
        {
            var classEntity = context.Classes.FirstOrDefault(c => c.Id == classId);
            if (classEntity is not null)
            {
                context.Classes.Remove(classEntity);
                context.SaveChanges();
            }
        }

        public void CreateSubject(string subjectName, string? description)
        {
            Subject subject = new() { Name = subjectName, Description = description };
            context.Subjects.Add(subject);
            context.SaveChanges();
        }

        public List<SubjectDto> GetAllSubjects()
            => [.. context.Subjects
                .Select(s => new SubjectDto(s.Id, s.Name, s.Description))];

        public void UpdateSubject(int subjectId, string subjectName, string? description)
        {
            var subject = context.Subjects.FirstOrDefault(s => s.Id == subjectId);
            if (subject is not null)
            {
                subject.Name = subjectName;
                subject.Description = description;
                context.SaveChanges();
            }
        }

        public void DeleteSubject(int subjectId)
        {
            var subject = context.Subjects.FirstOrDefault(s => s.Id == subjectId);
            if (subject is not null)
            {
                context.Subjects.Remove(subject);
                context.SaveChanges();
            }
        }

        public void AssignSubjectToClass(int classId, int subjectId)
        {
            var exists = context.ClassSubjects.Any(cs => cs.ClassId == classId && cs.SubjectId == subjectId);
            if (exists) return;

            context.ClassSubjects.Add(new ClassSubject { ClassId = classId, SubjectId = subjectId });
            context.SaveChanges();
        }

        public List<SubjectDto> GetSubjectsForClass(int classId)
            => [.. context.ClassSubjects
                .Where(cs => cs.ClassId == classId)
                .Include(cs => cs.subjects)
                .Select(cs => new SubjectDto(cs.subjects.Id, cs.subjects.Name, cs.subjects.Description))];

        public void AssignTeacherToClassSubject(int teacherId, int classId, int subjectId)
        {
            var classSubjectExists = context.ClassSubjects.Any(cs => cs.ClassId == classId && cs.SubjectId == subjectId);
            if (!classSubjectExists) return;

            var exists = context.TeacherAssignments.Any(ta =>
                ta.TeacherId == teacherId && ta.ClassId == classId && ta.SubjectId == subjectId);
            if (exists) return;

            context.TeacherAssignments.Add(new TeacherAssignment
            {
                TeacherId = teacherId,
                ClassId = classId,
                SubjectId = subjectId
            });
            context.SaveChanges();
        }

        public List<TeacherAssignmentDto> GetTeacherAssignments(int teacherId)
            => [.. context.TeacherAssignments
                .Where(ta => ta.TeacherId == teacherId)
                .Select(ta => new TeacherAssignmentDto(ta.Id, ta.TeacherId, ta.ClassId, ta.SubjectId, ta.classes.Name, ta.subjects.Name))];
    }
}