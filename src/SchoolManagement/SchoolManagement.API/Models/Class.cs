using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolManagement.API.Models
{
    public class Class
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }

        public ICollection<ClassSubject> classSubjects { get; set; } = new List<ClassSubject>();
        public ICollection<Student> students { get; set; } = new List<Student>();
        public ICollection<TeacherAssignment> teacherAssignments { get; set; } = new List<TeacherAssignment>();
    }
}
