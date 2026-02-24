using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace SchoolManagement.API.Models
{
    public class TeacherAssignment
    {
        public int Id { get; set; }

        public int TeacherId { get; set; }
        public int ClassId { get; set; }
        public int SubjectId { get; set; }

        public User teachers { get; set; } = null!;
        public Class classes { get; set; } = null!;
        public Subject subjects { get; set; } = null!;
    }
}
