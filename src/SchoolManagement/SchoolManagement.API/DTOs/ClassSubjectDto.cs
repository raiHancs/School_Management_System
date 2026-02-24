namespace SchoolManagement.API.DTOs
{
    public record ClassSubjectDto(
    int Id,
    int ClassId,
    int SubjectId
    // classes dropped: navigates back to Class
    // subjects dropped: navigates back to Subject
);
}
