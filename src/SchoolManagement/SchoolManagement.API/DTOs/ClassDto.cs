namespace SchoolManagement.API.DTOs
{
    public record ClassDto(
    int Id,
    string Name,
    string? Description,
    ICollection<ClassSubjectDto> ClassSubjects,
    ICollection<StudentDto> Students,
    ICollection<TeacherAssignmentDto> TeacherAssignments
);
}
