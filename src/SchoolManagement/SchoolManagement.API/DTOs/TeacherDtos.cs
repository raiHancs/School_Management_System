namespace SchoolManagement.API.DTOs
{
    public record CreateStudentDto(int ClassId, string StudentName, string? RollNumber);
    public record UpdateStudentDto(string StudentName, string? RollNumber);

    public record AssignGradeDto(
        int StudentId,
        int SubjectId,
        string Term,
        decimal MarksObtained,
        decimal TotalMarks
    );
}