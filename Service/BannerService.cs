using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;

namespace BookingSalonHair.Service
{
    public class BannerService : IBannerService
    {
        private readonly SalonContext _context;

        public BannerService(SalonContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Banner>> GetAllBannersAsync()
        {
            return await _context.Banners.ToListAsync(); // Trả về tất cả banners
        }

        public async Task<Banner> GetBannerByIdAsync(int id)
        {
            return await _context.Banners.FindAsync(id); // Trả về banner theo id
        }

        public async Task<Banner> CreateBannerAsync(Banner banner)
        {
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();
            return banner;
        }

        public async Task<Banner> UpdateBannerAsync(int id, BannerUpdateDto bannerDto)
        {
            // Kiểm tra nếu bannerDto không hợp lệ
            if (bannerDto == null)
            {
                throw new ArgumentNullException(nameof(bannerDto), "Dữ liệu banner cung cấp không hợp lệ.");
            }

            // Tìm banner hiện có
            var banner = await _context.Banners.FindAsync(id);

            // Nếu banner không tồn tại, trả về null hoặc có thể ném ngoại lệ hoặc trả về phản hồi tùy chỉnh
            if (banner == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy Banner với ID {id}.");
            }

            // Map các thuộc tính từ DTO vào entity (đảm bảo tên thuộc tính khớp)
            banner.Title = bannerDto.Title;
            banner.Description = bannerDto.Description;
            banner.imageurl = bannerDto.ImageUrl; // Đảm bảo tên thuộc tính khớp (chú ý đến chữ hoa và chữ thường)
            banner.Link = bannerDto.Link;
            banner.Status = bannerDto.Status;
            banner.UpdatedAt = DateTime.UtcNow;

            try
            {
                // Cập nhật banner trong cơ sở dữ liệu
                _context.Banners.Update(banner);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Ghi lại lỗi và ném ngoại lệ nếu có vấn đề trong quá trình cập nhật
                throw new InvalidOperationException("Có lỗi khi cập nhật banner", ex);
            }

            // Trả về banner đã được cập nhật
            return banner;
        }

        public async Task<bool> DeleteBannerAsync(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null)
                return false;

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
