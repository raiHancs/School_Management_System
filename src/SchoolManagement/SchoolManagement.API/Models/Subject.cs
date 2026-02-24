using SchoolManagement.API.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolManagement.API.Models
{
    public class Subject
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }

        public ICollection<ClassSubject> classSubjects { get; set; } = new List<ClassSubject>();
        public ICollection<TeacherAssignment> teacherAssignments { get; set; } = new List<TeacherAssignment>();
        public ICollection<Grade> grades { get; set; } = new List<Grade>();
    }
}
