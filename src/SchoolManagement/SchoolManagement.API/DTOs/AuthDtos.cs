namespace SchoolManagement.API.DTOs
{
    public record LoginDto(string Username, string Password);

    public record LoginResponseDto(
        int UserId,
        string Username,
        string Email,
        string UserType
    );
}