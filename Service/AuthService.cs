using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SalonBooking.API.Data;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BookingSalonHair.Services
{
    public class AuthService : IAuthService
    {
        private readonly SalonContext _context;
        private readonly IConfiguration _config;

        public AuthService(SalonContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string> RegisterAsync(RegisterDTO model)
        {
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                return "Email đã được sử dụng.";

            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                Phone = model.Phone,
                Role = model.Role,
                PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(model.Password))
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return "Đăng ký thành công";
        }

        public async Task<string> LoginAsync(LoginDTO model)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == model.Email);
            if (user == null) return "Email không tồn tại";

            var passwordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(model.Password));
            if (user.PasswordHash != passwordHash) return "Mật khẩu không đúng";

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
