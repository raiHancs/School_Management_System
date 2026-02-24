using Microsoft.AspNetCore.Mvc;
using SchoolManagement.API.DTOs;
using SchoolManagement.Services;

namespace SchoolManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public ActionResult<LoginResponseDto> Login([FromBody] LoginDto loginDto)
        {
            var user = _authService.Login(loginDto.Username, loginDto.Password);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new LoginResponseDto(
                user.Id,
                user.Name,
                user.Email,
                user.UserType.ToString()
            ));
        }
    }
}