using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;

namespace BookingSalonHair.Service
{
    public class ContactService : IContactService
    {
        private readonly SalonContext _context;

        public ContactService(SalonContext context)
        {
            _context = context;
        }

        public async Task<Contact> CreateAsync(ContactDto dto)
        {
            var contact = new Contact
            {
                Name = dto.Name,
                Email = dto.Email,
                Message = dto.Message,
                UserId = dto.UserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();
            return contact;
        }

        public async Task<IEnumerable<Contact>> GetAllAsync()
        {
            return await _context.Contacts
                .Include(c => c.User) // lấy luôn user
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Contact> GetByIdAsync(int id)
        {
            return await _context.Contacts
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return false;

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
