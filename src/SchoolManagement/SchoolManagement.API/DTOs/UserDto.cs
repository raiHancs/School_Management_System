using SchoolManagement.API.Models;

namespace SchoolManagement.API.DTOs
{
    public record UserDto(
    int Id,
    string Name,
    string Email,
    User.userType UserType
    // teacherAssignments dropped: TeacherAssignment.teachers navigates back to User
);
}
