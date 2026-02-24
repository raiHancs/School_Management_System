namespace SchoolManagement.API.DTOs
{
    public record SubjectDto(
    int Id,
    string Name,
    string? Description
    // collections dropped: all three navigate back to Subject
);
}
