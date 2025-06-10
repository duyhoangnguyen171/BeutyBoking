using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BookingSalonHair.Helpers
{
    public class JwtHelper
    {
        private readonly string _key;
        private readonly string _issuer;
        private readonly string _audience;

        public JwtHelper(IConfiguration configuration)
        {
            _key = configuration["Jwt:Key"];
            _issuer = configuration["Jwt:Issuer"];
            _audience = configuration["Jwt:Audience"];
        }

        /// <summary>
        /// Generates a JWT token string based on provided user information and claims.
        /// </summary>
        /// <param name="userId">User identifier.</param>
        /// <param name="fullName">User full name.</param>
        /// <param name="email">User email address.</param>
        /// <param name="role">User role.</param>
        /// <param name="staffId">Optional staff ID claim.</param>
        /// <returns>Signed JWT token as a string.</returns>
        public string GenerateToken(int userId, string fullName, string email, string role, string staffId = null)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var keyBytes = Encoding.UTF8.GetBytes(_key);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, fullName),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role.ToLower())
            };

            if (!string.IsNullOrEmpty(staffId))
                claims.Add(new Claim("StaffId", staffId));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(keyBytes),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
