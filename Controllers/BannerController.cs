using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class BannerController : ControllerBase
{
    private readonly IBannerService _bannerService;
    private readonly SalonContext _context;

    public BannerController(IBannerService bannerService)
    {
        _bannerService = bannerService;
    }

    // Lấy tất cả banners
    [HttpGet]
    public async Task<IActionResult> GetAllBanners()
    {
        var banners = await _bannerService.GetAllBannersAsync();

        // Chuyển đổi danh sách Banner thành danh sách BannerDto
        var bannerDtos = banners.Select(b => new BannerDto
        {
            Id = b.Id,
            Title = b.Title,
            Description = b.Description,
            imageurl = b.imageurl,  // Lưu ý tên trường phải trùng với Banner
            Link = b.Link,
            Status = b.Status,
            CreatedAt = b.CreatedAt,
            UpdatedAt = b.UpdatedAt
        }).ToList();

        return Ok(bannerDtos);  // Trả về danh sách BannerDto
    }

    // Lấy banner theo ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBannerById(int id)
    {
        var banner = await _bannerService.GetBannerByIdAsync(id);
        if (banner == null)
        {
            return NotFound("Banner không tồn tại.");
        }
        return Ok(banner);
    }

    // Tạo mới banner
    [HttpPost]
    public async Task<IActionResult> CreateBanner([FromBody] BannerCreateDto bannerDto)
    {
        if (bannerDto == null)
        {
            return BadRequest("Thông tin banner không hợp lệ.");
        }

        var banner = new Banner
        {
            Title = bannerDto.Title,
            Description = bannerDto.Description,
            imageurl = bannerDto.imageurl,
            Link = bannerDto.Link,
            Status = bannerDto.Status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdBanner = await _bannerService.CreateBannerAsync(banner);

        var createdBannerDto = new BannerDto
        {
            Id = createdBanner.Id,
            Title = createdBanner.Title,
            Description = createdBanner.Description,
            imageurl = createdBanner.imageurl,
            Link = createdBanner.Link,
            Status = createdBanner.Status,
            CreatedAt = createdBanner.CreatedAt,
            UpdatedAt = createdBanner.UpdatedAt
        };

        return CreatedAtAction(nameof(GetBannerById), new { id = createdBannerDto.Id }, createdBannerDto);
    }

    // Cập nhật banner
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBanner(int id, [FromBody] BannerUpdateDto bannerDto)
    {
        try
        {
            // Gọi dịch vụ để cập nhật banner
            var updatedBanner = await _bannerService.UpdateBannerAsync(id, bannerDto);

            // Trả về banner đã được cập nhật
            return Ok(updatedBanner);
        }
        catch (KeyNotFoundException ex)
        {
            // Nếu banner không tìm thấy, trả về 404
            return NotFound(ex.Message);
        }
        catch (ArgumentNullException ex)
        {
            // Nếu dữ liệu không hợp lệ (yêu cầu không hợp lệ), trả về 400
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            // Lỗi chung, trả về 500
            return StatusCode(500, "Có lỗi xảy ra khi cập nhật banner.");
        }
    }


    // Xóa banner
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBanner(int id)
    {
        var isDeleted = await _bannerService.DeleteBannerAsync(id);
        if (!isDeleted)
        {
            return NotFound("Banner không tồn tại.");
        }
        return NoContent();
    }
}
