using BookingSalonHair.DTOs;
using BookingSalonHair.Models;

namespace BookingSalonHair.Interfaces
{
    public interface IBannerService
    {
        Task<IEnumerable<Banner>> GetAllBannersAsync();
        Task<Banner> GetBannerByIdAsync(int id);
        Task<Banner> CreateBannerAsync(Banner banner);
        Task<Banner> UpdateBannerAsync(int id, BannerUpdateDto bannerDto);
        Task<bool> DeleteBannerAsync(int id);
    }
}
