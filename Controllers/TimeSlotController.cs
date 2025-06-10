// ✅ Final version of TimeSlotsController (no StaffId dependency)

using BookingSalonHair.DTOs;
using BookingSalonHair.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingSalonHair.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin,staff")]
    public class TimeSlotsController : ControllerBase
    {
        private readonly SalonContext _db;

        public TimeSlotsController(SalonContext context)
        {
            _db = context;
        }

        // GET: api/TimeSlots/{workShiftId}
        [HttpGet("{workShiftId}")]
        public async Task<ActionResult<IEnumerable<TimeSlot>>> GetTimeSlotsByWorkShiftId(int workShiftId)
        {
            var workShift = await _db.WorkShifts
                .Include(ws => ws.TimeSlots)
                .FirstOrDefaultAsync(ws => ws.Id == workShiftId);

            if (workShift == null)
                return NotFound("WorkShift not found.");

            return Ok(workShift.TimeSlots);
        }

        // POST: api/TimeSlots
        [HttpPost]
        public async Task<ActionResult<TimeSlot>> CreateTimeSlot([FromBody] TimeSlotsDto timeSlotDto)
        {
            if (timeSlotDto == null)
                return BadRequest("Dữ liệu không hợp lệ.");

            var workShift = await _db.WorkShifts.FindAsync(timeSlotDto.WorkShiftId);
            if (workShift == null)
                return NotFound("Ca làm việc không tồn tại.");

            var timeSlot = new TimeSlot
            {
                StartTime = timeSlotDto.StartTime,
                EndTime = timeSlotDto.EndTime,
                IsAvailable = timeSlotDto.IsAvailable,
                WorkShiftId = timeSlotDto.WorkShiftId,
                Date = workShift.Date
            };

            _db.TimeSlots.Add(timeSlot);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTimeSlotsByWorkShiftId), new { workShiftId = timeSlot.WorkShiftId }, timeSlot);
        }

        // PUT: api/TimeSlots/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTimeSlot(int id, [FromBody] TimeSlotsDto timeSlotDto)
        {
            if (timeSlotDto == null)
                return BadRequest("Dữ liệu không hợp lệ.");

            var timeSlot = await _db.TimeSlots.FindAsync(id);
            if (timeSlot == null)
                return NotFound("TimeSlot not found.");

            timeSlot.StartTime = timeSlotDto.StartTime;
            timeSlot.EndTime = timeSlotDto.EndTime;
            timeSlot.IsAvailable = timeSlotDto.IsAvailable;

            await _db.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/TimeSlots/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTimeSlot(int id)
        {
            var timeSlot = await _db.TimeSlots.FindAsync(id);
            if (timeSlot == null)
                return NotFound("TimeSlot not found.");

            _db.TimeSlots.Remove(timeSlot);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
