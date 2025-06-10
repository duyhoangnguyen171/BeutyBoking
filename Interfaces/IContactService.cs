using BookingSalonHair.DTOs;
using BookingSalonHair.Models;

namespace BookingSalonHair.Interfaces
{
    public interface IContactService
    {
        Task<Contact> CreateAsync(ContactDto dto);
        Task<IEnumerable<Contact>> GetAllAsync();
        Task<Contact> GetByIdAsync(int id);
        Task<bool> DeleteAsync(int id);
    }

}
