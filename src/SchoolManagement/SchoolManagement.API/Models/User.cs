using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolManagement.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Name { get; set; } = string.Empty;
        public required string Email { get; set; } = string.Empty;
        public required string Password { get; set; } = string.Empty;
        public userType UserType { get; set; }
        public enum userType { Admin, Teacher }

        public ICollection<TeacherAssignment> teacherAssignments { get; set; } = new List<TeacherAssignment>();
    }
}
