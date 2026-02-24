namespace SchoolManagement.API.DTOs
{
    public record CreateTeacherDto(string Username,string Email, string Password );
    public record UpdateTeacherDto(string Username, string Email, string Password);

    public record CreateClassDto(string ClassName, string? Description);
    public record UpdateClassDto(string ClassName, string? Description);

    public record CreateSubjectDto(string SubjectName, string? Description);
    public record UpdateSubjectDto(string SubjectName, string? Description);

    public record AssignSubjectToClassDto(int ClassId, int SubjectId);
    public record AssignTeacherDto(int TeacherId, int ClassId, int SubjectId);
}