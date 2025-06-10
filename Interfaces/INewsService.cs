using BookingSalonHair.DTOs;
using BookingSalonHair.Models;

namespace BookingSalonHair.Interfaces
{
    public interface INewsService
    {
        Task<IEnumerable<News>> GetAllAsync();
        Task<News> GetByIdAsync(int id);
        Task<News> CreateAsync(NewsCreateDto dto);
        Task<News> UpdateAsync(NewsUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
