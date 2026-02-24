using Microsoft.AspNetCore.Mvc;
using SchoolManagement.API.DTOs;
using SchoolManagement.Services;

namespace SchoolManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly TeacherService _teacherService;

        public TeacherController(TeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        [HttpGet("{teacherId}/assignments")]
        public ActionResult<IEnumerable<TeacherAssignmentDto>> GetMyAssignments(int teacherId)
            => Ok(_teacherService.GetMyAssignments(teacherId));

        [HttpGet("{teacherId}/classes/{classId}/students")]
        public ActionResult<IEnumerable<StudentDto>> GetStudents(int teacherId, int classId)
            => Ok(_teacherService.GetStudentsForClass(teacherId, classId));

        [HttpPost("{teacherId}/students")]
        public ActionResult CreateStudent(int teacherId, [FromBody] CreateStudentDto dto)
        {
            _teacherService.CreateStudent(teacherId, dto.ClassId, dto.StudentName, dto.RollNumber);
            return Ok(new { message = "Student created successfully" });
        }

        [HttpPut("{teacherId}/students/{studentId}")]
        public ActionResult UpdateStudent(int teacherId, int studentId, [FromBody] UpdateStudentDto dto)
        {
            _teacherService.UpdateStudent(teacherId, studentId, dto.StudentName, dto.RollNumber);
            return Ok(new { message = "Student updated successfully" });
        }

        [HttpDelete("{teacherId}/students/{studentId}")]
        public ActionResult DeleteStudent(int teacherId, int studentId)
        {
            _teacherService.DeleteStudent(teacherId, studentId);
            return Ok(new { message = "Student deleted successfully" });
        }

        [HttpPost("{teacherId}/grades")]
        public ActionResult AssignGrade(int teacherId, [FromBody] AssignGradeDto dto)
        {
            _teacherService.AssignGrade(teacherId, dto.StudentId, dto.SubjectId, dto.Term, dto.MarksObtained, dto.TotalMarks);
            return Ok(new { message = "Grade assigned successfully" });
        }

        [HttpGet("{teacherId}/students/{studentId}/grades")]
        public ActionResult<IEnumerable<GradeDto>> GetStudentGrades(int teacherId, int studentId)
            => Ok(_teacherService.GetStudentGrades(teacherId, studentId));

        [HttpGet("{teacherId}/classes/{classId}/subjects/{subjectId}/grades")]
        public ActionResult<IEnumerable<StudentGradesDto>> GetClassGrades(int teacherId, int classId, int subjectId)
            => Ok(_teacherService.GetClassGrades(teacherId, classId, subjectId));
    }
}