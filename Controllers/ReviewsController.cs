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
                return BadRequest("Invalid review data.");
            }

            // Lấy khách hàng theo CustomerId
            var customer = await _context.Users
                .Where(u => u.Id == reviewDto.CustomerId)
                .FirstOrDefaultAsync();

            if (customer == null)
            {
                return NotFound("Customer not found.");
            }

            // Kiểm tra xem khách hàng có lịch hẹn chưa hoàn thành hay không
            var lastCompletedAppointment = await _context.Appointments
                .Where(a => a.CustomerId == reviewDto.CustomerId && a.Status == AppointmentStatus.Completed)
                .OrderByDescending(a => a.AppointmentDate)
                .FirstOrDefaultAsync();

            if (lastCompletedAppointment == null)
            {
                // Nếu chưa có lịch hẹn hoàn thành, khách hàng chỉ được 1 lần đánh giá trong tháng
                var lastReview = await _context.Reviews
                    .Where(r => r.CustomerId == reviewDto.CustomerId && r.DateCreated > DateTime.Now.AddMonths(-1))
                    .CountAsync();

                if (lastReview >= 1)
                {
                    return BadRequest("You have already given a review in the last month.");
                }
            }
            else
            {
                // Nếu có lịch hẹn hoàn thành, khách hàng có thể đánh giá 2 lần trong tuần
                var reviewsThisWeek = await _context.Reviews
                    .Where(r => r.CustomerId == reviewDto.CustomerId && r.DateCreated > DateTime.Now.AddDays(-7))
                    .CountAsync();

                if (reviewsThisWeek >= 2)
                {
                    return BadRequest("You have already given two reviews this week. Please complete your next appointment to reset the limit.");
                }

                // Cập nhật số lần đánh giá của khách hàng trong tuần hoặc tháng
                customer.ReviewCount++;

                // Nếu đã đạt giới hạn số lần đánh giá trong tuần, yêu cầu khách hàng hoàn thành lịch hẹn tiếp theo
                if (customer.ReviewCount > 2)
                {
                    return BadRequest("You have already exceeded the review limit for this week.");
                }
            }

            // Kiểm tra OTP đã xác nhận và khách hàng đã xác nhận lịch hẹn
            var appointment = await _context.Appointments
                .Where(a => a.Id == reviewDto.AppointmentServiceId && a.CustomerId == reviewDto.CustomerId)
                .FirstOrDefaultAsync();

            if (appointment == null || !appointment.IsVerified)
            {
                return BadRequest("You must complete the appointment and verify it before reviewing.");
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

            // Lưu vào cơ sở dữ liệu
            _context.Reviews.Add(review);
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
