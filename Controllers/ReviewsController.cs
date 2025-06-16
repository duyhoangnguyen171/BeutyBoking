using BookingSalonHair.DTOs;
using BookingSalonHair.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;

namespace BookingSalonHair.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly SalonContext _context;

        public ReviewsController(SalonContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllReviews()
        {
            // Lấy tất cả các review từ cơ sở dữ liệu
            var reviews = await _context.Reviews.ToListAsync();

            // Kiểm tra xem có review không
            if (reviews == null || !reviews.Any())
            {
                return NotFound("No reviews found.");
            }

            // Chuyển đổi các review thành DTO và trả về kết quả
            var result = reviews.Select(r => new ReviewDTO
            {
                Id = r.Id,
                CustomerId = r.CustomerId,
                ServiceId = r.ServiceId,
                Rating = r.Rating,
                Comment = r.Comment,
                DateCreated = r.DateCreated
            });

            return Ok(result); // Trả về danh sách review dưới dạng JSON
        }
        // API để tạo mới một review
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ReviewDTO reviewDto)
        {
            if (reviewDto == null)
            {
                return BadRequest("Dữ liệu đánh giá không hợp lệ.");
            }

            // Lấy khách hàng theo CustomerId
            var customer = await _context.Users
                .Where(u => u.Id == reviewDto.CustomerId)
                .FirstOrDefaultAsync();

            if (customer == null)
            {
                return NotFound("Không tìm thấy khách hàng.");
            }

            // Lấy lịch hẹn hoàn thành của khách hàng
            var appointment = await _context.Appointments
                .Where(a => a.CustomerId == reviewDto.CustomerId && a.Id == reviewDto.AppointmentServiceId && a.Status == AppointmentStatus.Completed)
                .FirstOrDefaultAsync();

            if (appointment == null)
            {
                return BadRequest("Bạn chỉ có thể đánh giá khi lịch hẹn đã hoàn thành.");
            }

            // Kiểm tra xem lịch hẹn đã được đánh giá chưa
            if (appointment.HasReviewed)
            {
                return BadRequest("Lịch hẹn này đã được bạn đánh giá!");
            }

            // Kiểm tra thời gian đánh giá hợp lệ (trong vòng 30 ngày kể từ khi hoàn thành lịch hẹn)
            if (appointment.AppointmentDate.AddDays(30) < DateTime.Now)
            {
                return BadRequest("Thời gian đánh giá này đã hết (30 ngày kể từ khi hoàn thành lịch hẹn).");
            }

            // Tạo mới đối tượng Review từ DTO
            var review = new Review
            {
                CustomerId = reviewDto.CustomerId,
                ServiceId = reviewDto.ServiceId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                DateCreated = DateTime.Now,
                AppointmentId = reviewDto.AppointmentServiceId
            };

            // Lưu Review vào cơ sở dữ liệu
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Cập nhật AppointmentService để liên kết với Review
            var appointmentService = await _context.AppointmentServices
                .FirstOrDefaultAsync(asr => asr.AppointmentId == reviewDto.AppointmentServiceId && asr.ServiceId == reviewDto.ServiceId);

            if (appointmentService != null)
            {
                // Cập nhật ReviewId trong AppointmentService để liên kết Review với dịch vụ của lịch hẹn
                appointmentService.ReviewId = review.Id;
                _context.AppointmentServices.Update(appointmentService);
                await _context.SaveChangesAsync();
            }

            // Cập nhật trạng thái đã đánh giá cho lịch hẹn
            appointment.HasReviewed = true;
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();

            // Trả về kết quả dưới dạng ReviewDTO
            var result = new ReviewDTO
            {
                Id = review.Id,
                CustomerId = review.CustomerId,
                ServiceId = review.ServiceId,
                Rating = review.Rating,
                Comment = review.Comment,
                DateCreated = review.DateCreated
            };

            return CreatedAtAction(nameof(GetReviewById), new { id = result.Id }, result);
        }




        // API để lấy tất cả review của một dịch vụ
        [HttpGet("service/{serviceId}")]
        public async Task<IActionResult> GetReviewsByServiceId(int serviceId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ServiceId == serviceId)
                .ToListAsync();

            if (reviews == null || !reviews.Any())
            {
                return NotFound("No reviews found for this service.");
            }

            var result = reviews.Select(r => new ReviewDTO
            {
                Id = r.Id,
                CustomerId = r.CustomerId,
                ServiceId = r.ServiceId,
                Rating = r.Rating,
                Comment = r.Comment,
                DateCreated = r.DateCreated
            });

            return Ok(result);
        }

        // API để lấy tất cả review của một khách hàng
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetReviewsByCustomerId(int customerId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.CustomerId == customerId)
                .ToListAsync();

            if (reviews == null || !reviews.Any())
            {
                return NotFound("No reviews found for this customer.");
            }

            var result = reviews.Select(r => new ReviewDTO
            {
                Id = r.Id,
                CustomerId = r.CustomerId,
                ServiceId = r.ServiceId,
                Rating = r.Rating,
                Comment = r.Comment,
                DateCreated = r.DateCreated
            });

            return Ok(result);
        }
        [HttpGet("GetReviewsForCustomer")]
        public async Task<IActionResult> GetReviewsForCustomer(int customerId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.CustomerId == customerId && r.DateCreated > DateTime.Now.AddDays(-30))
                .ToListAsync();

            return Ok(reviews);
        }
        // API để lấy một review theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewById(int id)
        {
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
            {
                return NotFound("Review not found.");
            }

            var result = new ReviewDTO
            {
                Id = review.Id,
                CustomerId = review.CustomerId,
                ServiceId = review.ServiceId,
                Rating = review.Rating,
                Comment = review.Comment,
                DateCreated = review.DateCreated,
                AppointmentServiceId = (int)review.AppointmentId // Trả về AppointmentId
            };

            return Ok(result);
        }
        [HttpDelete("RemoveExpiredReviews")]
        public async Task<IActionResult> RemoveExpiredReviews()
        {
            var expirationDate = DateTime.UtcNow.AddDays(-30);

            var expiredReviews = await _context.Reviews
                .Where(r => r.DateCreated <= expirationDate)
                .ToListAsync();

            if (expiredReviews.Any())
            {
                _context.Reviews.RemoveRange(expiredReviews);
                await _context.SaveChangesAsync();
                return Ok($"{expiredReviews.Count} expired reviews have been deleted.");
            }

            return Ok("No expired reviews to delete.");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            // Tìm review theo ID
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.Id == id);

            // Kiểm tra xem review có tồn tại không
            if (review == null)
            {
                return NotFound("Review not found.");
            }

            // Xóa review
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            // Trả về kết quả xóa thành công
            return NoContent();  // Trả về mã 204 NoContent khi xóa thành công
        }

    }

}
