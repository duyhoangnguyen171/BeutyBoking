using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingSalonHair.Services
{
    public class UserService : IUserService
    {
        private readonly SalonContext _context;

        public UserService(SalonContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> UpdateUserAsync(int id, User user)
        {
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return null;

            existingUser.FullName = user.FullName;
            existingUser.Phone = user.Phone;
            existingUser.Role = user.Role;

            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        Task<IEnumerable<UserDTO>> IUserService.GetAllUsersAsync()
        {
            throw new NotImplementedException();
        }

        Task<UserDTO> IUserService.GetUserByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<UserDTO> UpdateUserAsync(int id, UpdateUserDTO dto)
        {
            throw new NotImplementedException();
        }
    }
}