using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolManagement.API.Models
{
    public class Grade
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int SubjectId { get; set; }
        public required string? Term { get; set; }
        public decimal ObtainMarks { get; set; }
        public decimal TotalMarks { get; set; }
        public string? GradeLetter { get; set; }

        public Student students { get; set; } = null!;
        public Subject subjects { get; set; } = null!;
    }
}
