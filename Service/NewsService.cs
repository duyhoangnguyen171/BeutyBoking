using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models; // Giả sử bạn có News model trong đây
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;

namespace BookingSalonHair.Services
{
    public class NewsService : INewsService
    {
        private readonly SalonContext _context;

        public NewsService(SalonContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<News>> GetAllAsync()
        {
            return await _context.News.ToListAsync();
        }

        public async Task<News> GetByIdAsync(int id)
        {
            return await _context.News.FindAsync(id);
        }

        public async Task<News> CreateAsync(NewsCreateDto dto)
        {
            var news = new News
            {
                Title = dto.Title,
                Content = dto.Content,
                imageurl = dto.Imageurl, // Kiểu string
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.News.Add(news);
            await _context.SaveChangesAsync();
            return news;
        }

        public async Task<News> UpdateAsync(NewsUpdateDto dto)
        {
            var news = await _context.News.FindAsync(dto.Id);
            if (news == null) return null;

            news.Title = dto.Title;
            news.Content = dto.Content;
            news.imageurl = dto.Imageurl;
            news.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return news;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return false;

            _context.News.Remove(news);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
