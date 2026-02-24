using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolManagement.API.Models
{
    public class Student
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? RollNumber { get; set; }
        public int ClassId { get; set; }

        public Class classes { get; set; } = null!;
        public ICollection<Grade> grades { get; set; } = new List<Grade>();
        public ICollection<Subject> subjects { get; set; } = new List<Subject>();
    }
}
