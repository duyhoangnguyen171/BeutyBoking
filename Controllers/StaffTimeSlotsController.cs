using BookingSalonHair.DTOs;
using BookingSalonHair.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;

namespace BookingSalonHair.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "staff,admin")]
    public class StaffTimeSlotssController : ControllerBase
    {
        private readonly SalonContext _context;

        public StaffTimeSlotssController(SalonContext context)
        {
            _context = context;
        }

        // POST: api/StaffTimeSlotss
        [HttpPost]
        public async Task<IActionResult> RegisterStaffTimeSlots([FromBody] RegisterStaffTimeSlotDto dto)
        {
            var timeSlot = await _context.TimeSlots.FindAsync(dto.TimeSlotId);
            if (timeSlot == null)
                return NotFound("TimeSlot không tồn tại.");

            // Check duplicate
            var exists = await _context.StaffTimeSlots.AnyAsync(x =>
                x.StaffId == dto.StaffId && x.TimeSlotId == dto.TimeSlotId);
            if (exists)
                return BadRequest("Bạn đã đăng ký slot này.");

            // Optional: check overlapping slot for same user on same day

            var newEntry = new StaffTimeSlot
            {
                StaffId = dto.StaffId,
                TimeSlotId = dto.TimeSlotId,
                WorkShiftId = dto.WorkShiftId,
                RegisteredAt = DateTime.UtcNow,
                IsApproved = false
            };

            _context.StaffTimeSlots.Add(newEntry);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký slot thành công." });
        }

        // GET: api/StaffTimeSlotss/staff/{staffId}/date/{date}
        [HttpGet("staff/{staffId}/date/{date}")]
        public async Task<IActionResult> GetSlotsByStaffAndDate(int staffId, DateTime date)
        {
            var result = await _context.StaffTimeSlots
                .Include(x => x.TimeSlot)
                .Where(x => x.StaffId == staffId && x.TimeSlot.Date.Date == date.Date)
                .ToListAsync();

            return Ok(result);
        }

        // DELETE: api/StaffTimeSlotss/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteStaffTimeSlots(int id)
        {
            var slot = await _context.StaffTimeSlots.FindAsync(id);
            if (slot == null)
                return NotFound();

            _context.StaffTimeSlots.Remove(slot);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/StaffTimeSlotss/{id}/approve
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> ApproveSlot(int id)
        {
            var slot = await _context.StaffTimeSlots.FindAsync(id);
            if (slot == null)
                return NotFound();

            slot.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã duyệt slot thành công." });
        }
    }
}
