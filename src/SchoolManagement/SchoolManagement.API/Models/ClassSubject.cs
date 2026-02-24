using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolManagement.API.Models
{
    public class ClassSubject
    {
        public int Id { get; set; }
        public int ClassId { get; set; }
        public int SubjectId { get; set; }

        public Class classes { get; set; } = null!;
        public Subject subjects { get; set; } = null!;
    }
}
