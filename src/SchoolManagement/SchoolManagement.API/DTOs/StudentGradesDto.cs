namespace SchoolManagement.API.DTOs
{
    public record StudentGradesDto(
    int StudentId,
    string StudentName,
    GradeDto? FirstTerm,
    GradeDto? MidTerm,
    GradeDto? FinalTerm,
    string Average
);
}
