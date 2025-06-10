using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookingSalonHair.DTOs;
using BookingSalonHair.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using SalonBooking.API.Data;
using BookingSalonHair.Helpers;
namespace BookingSalonHair.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SalonContext _context;
        private readonly IConfiguration _configuration;
        private readonly JwtHelper _jwtHelper;
        private readonly EmailHelper _emailHelper;
        public AuthController(SalonContext context, IConfiguration configuration, JwtHelper jwtHelper, EmailHelper emailHelper)
        {
            _context = context;
            _configuration = configuration;
            _jwtHelper = jwtHelper;
            _emailHelper = emailHelper;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            if (string.IsNullOrWhiteSpace(model.Email))
                return BadRequest("Email không được để trống.");

            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                return BadRequest("Email đã được sử dụng.");

            if (await _context.Users.AnyAsync(u => u.Phone == model.Phone))
                return BadRequest("Số điện thoại đã được sử dụng.");

            if (string.IsNullOrWhiteSpace(model.Password))
                return BadRequest("Mật khẩu không được để trống.");

            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(model.Password)),
                Phone = model.Phone,
                Role = model.Role,
                IsGuest = model.IsGuest
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công" });
        }




        // POST: api/Auth/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            // Tìm user bằng Email
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                return Unauthorized("Email không đúng.");
            }

            var hashInput = Convert.ToBase64String(Encoding.UTF8.GetBytes(model.Password));
            if (hashInput != user.PasswordHash)
            {
                return Unauthorized("Mật khẩu không đúng.");
            }
            var token = _jwtHelper.GenerateToken(
                userId: user.Id,
                fullName: user.FullName,
                email: user.Email,
                role: user.Role,
                staffId: user.Role.ToLower() == "staff" ? user.Id.ToString() : null
            );
            try
            {
                await _emailHelper.SendEmailAsync(user.Email, "Thông báo đăng nhập", $"Xin chào {user.FullName}, bạn đã đăng nhập vào Website BeutySalon vào lúc {DateTime.Now.ToString("HH:mm dd/MM/yyyy")}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi gửi email: {ex.Message}");
            }

            return Ok(new { token });
           
        }
    }
}
