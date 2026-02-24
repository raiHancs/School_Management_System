namespace SchoolManagement.API.DTOs
{
    public record TeacherAssignmentDto(
    int Id,
    int TeacherId,
    int ClassId,
    int SubjectId,
    string ClassName,
    string SubjectName
// teachers dropped: navigates back to User
// classes dropped: navigates back to Class
// subjects dropped: navigates back to Subject
);
}
