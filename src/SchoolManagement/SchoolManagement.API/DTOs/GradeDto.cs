namespace SchoolManagement.API.DTOs
{
    public record GradeDto(
    int Id,
    int StudentId,
    int SubjectId,
    string? Term,
    decimal ObtainMarks,
    decimal TotalMarks,
    string? GradeLetter
    // students dropped: navigates back to Student
    // subjects dropped: navigates back to Subject
);
}
