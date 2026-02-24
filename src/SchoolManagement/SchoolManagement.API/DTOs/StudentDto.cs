namespace SchoolManagement.API.DTOs
{
    public record StudentDto(
    int Id,
    string Name,
    string? RollNumber,
    int ClassId,
    string ClassName,
    ICollection<GradeDto> Grades,
    ICollection<SubjectDto> Subjects
    // classes dropped: ClassDto already contains StudentDto → would cycle
);
}
