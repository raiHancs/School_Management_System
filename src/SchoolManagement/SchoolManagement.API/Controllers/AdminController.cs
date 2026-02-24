using Microsoft.AspNetCore.Mvc;
using SchoolManagement.API.DTOs;
using SchoolManagement.Services;

namespace SchoolManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;

        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        // Teachers
        [HttpGet("teachers")]
        public ActionResult<IEnumerable<UserDto>> GetAllTeachers()
            => Ok(_adminService.GetAllTeachers());

        [HttpGet("teachers/{id}")]
        public ActionResult<UserDto> GetTeacher(int id)
        {
            var teacher = _adminService.GetTeacherById(id);
            return teacher == null ? NotFound() : Ok(teacher);
        }

        [HttpPost("teachers")]
        public ActionResult CreateTeacher([FromBody] CreateTeacherDto dto)
        {
            try
            {
                _adminService.CreateTeacher(dto.Username, dto.Email, dto.Password);
                return Ok(new { message = "Teacher created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("teachers/{id}")]
        public ActionResult UpdateTeacher(int id, [FromBody] UpdateTeacherDto dto)
        {
            _adminService.UpdateTeacher(id, dto.Username, dto.Email, dto.Password);
            return Ok(new { message = "Teacher updated successfully" });
        }

        [HttpDelete("teachers/{id}")]
        public ActionResult DeleteTeacher(int id)
        {
            _adminService.DeleteTeacher(id);
            return Ok(new { message = "Teacher deleted successfully" });
        }

        // Classes
        [HttpGet("classes")]
        public ActionResult<IEnumerable<ClassDto>> GetAllClasses()
            => Ok(_adminService.GetAllClasses());

        [HttpPost("classes")]
        public ActionResult CreateClass([FromBody] CreateClassDto dto)
        {
            _adminService.CreateClass(dto.ClassName, dto.Description);
            return Ok(new { message = "Class created successfully" });
        }

        [HttpPut("classes/{id}")]
        public ActionResult UpdateClass(int id, [FromBody] UpdateClassDto dto)
        {
            _adminService.UpdateClass(id, dto.ClassName, dto.Description);
            return Ok(new { message = "Class updated successfully" });
        }

        [HttpDelete("classes/{id}")]
        public ActionResult DeleteClass(int id)
        {
            _adminService.DeleteClass(id);
            return Ok(new { message = "Class deleted successfully" });
        }

        // Subjects
        [HttpGet("subjects")]
        public ActionResult<IEnumerable<SubjectDto>> GetAllSubjects()
            => Ok(_adminService.GetAllSubjects());

        [HttpPost("subjects")]
        public ActionResult CreateSubject([FromBody] CreateSubjectDto dto)
        {
            _adminService.CreateSubject(dto.SubjectName, dto.Description);
            return Ok(new { message = "Subject created successfully" });
        }

        [HttpPut("subjects/{id}")]
        public ActionResult UpdateSubject(int id, [FromBody] UpdateSubjectDto dto)
        {
            _adminService.UpdateSubject(id, dto.SubjectName, dto.Description);
            return Ok(new { message = "Subject updated successfully" });
        }

        [HttpDelete("subjects/{id}")]
        public ActionResult DeleteSubject(int id)
        {
            _adminService.DeleteSubject(id);
            return Ok(new { message = "Subject deleted successfully" });
        }

        // Assignments
        [HttpPost("assign-subject-to-class")]
        public ActionResult AssignSubjectToClass([FromBody] AssignSubjectToClassDto dto)
        {
            _adminService.AssignSubjectToClass(dto.ClassId, dto.SubjectId);
            return Ok(new { message = "Subject assigned to class successfully" });
        }

        [HttpGet("classes/{classId}/subjects")]
        public ActionResult<IEnumerable<SubjectDto>> GetClassSubjects(int classId)
            => Ok(_adminService.GetSubjectsForClass(classId));

        [HttpPost("assign-teacher")]
        public ActionResult AssignTeacher([FromBody] AssignTeacherDto dto)
        {
            _adminService.AssignTeacherToClassSubject(dto.TeacherId, dto.ClassId, dto.SubjectId);
            return Ok(new { message = "Teacher assigned successfully" });
        }

        [HttpGet("teachers/{teacherId}/assignments")]
        public ActionResult<IEnumerable<TeacherAssignmentDto>> GetTeacherAssignments(int teacherId)
            => Ok(_adminService.GetTeacherAssignments(teacherId));
    }
}