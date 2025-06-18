using BookingSalonHair.DTOs;
using BookingSalonHair.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
//[Authorize(Roles = "admin,staff")]
public class UserWorkShiftController : ControllerBase
{
    private readonly SalonContext _context;

    public UserWorkShiftController(SalonContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<IEnumerable<WorkShift>>> GetWorkShiftsByUserId(int userId)
    {
        var userWorkShifts = await _context.UserWorkShifts
            .Where(uws => uws.UserId == userId)
            .Include(uws => uws.WorkShift)
            .Select(uws => uws.WorkShift)
            .ToListAsync();

        if (!userWorkShifts.Any())
            return NotFound(new { message = "No work shifts found for the given user." });

        return Ok(userWorkShifts);
    }

    [HttpPut("AssignStaff")]
    public async Task<IActionResult> AssignStaffToAppointment(int appointmentId, int newStaffId)
    {
        var appointment = await _context.Appointments.FindAsync(appointmentId);
        if (appointment == null)
            return NotFound("Appointment not found");

        // Kiểm tra nếu nhân viên cũ có lịch đã được gán
        var oldStaffTimeSlot = await _context.StaffTimeSlots
            .FirstOrDefaultAsync(sts => sts.StaffId == appointment.StaffId && sts.TimeSlotId == appointment.StaffTimeSlotId);

        // Kiểm tra nếu nhân viên mới có lịch trùng với thời gian và ca làm hiện tại
        var newStaffTimeSlot = await _context.StaffTimeSlots
            .FirstOrDefaultAsync(sts => sts.StaffId == newStaffId && sts.TimeSlotId == appointment.StaffTimeSlotId);

        if (newStaffTimeSlot != null && newStaffTimeSlot.IsBooked == false)
        {
            // Nếu trạng thái IsBooked của nhân viên mới là false, tức là nhân viên mới đã có lịch tại khung giờ này
            return Conflict("Nhân viên mới đã có lịch tại khung giờ này.");
        }

        // Thực hiện gán lại nhân viên cho lịch hẹn
        appointment.StaffId = newStaffId;
        appointment.UpdatedAt = DateTime.UtcNow; // Cập nhật thời gian
        await _context.SaveChangesAsync(); // Lưu lại thay đổi cho lịch hẹn

        // Sau khi gán thành công, cập nhật trạng thái IsBooked cho nhân viên cũ
        if (oldStaffTimeSlot != null && oldStaffTimeSlot.IsBooked == false)
        {
            oldStaffTimeSlot.IsBooked = true;  // Đánh dấu là khung giờ có thể gán lại lịch
            _context.StaffTimeSlots.Update(oldStaffTimeSlot);
        }

        // Cập nhật trạng thái IsBooked của nhân viên mới thành false (đánh dấu đã có lịch)
        if (newStaffTimeSlot != null)
        {
            newStaffTimeSlot.IsBooked = false; // Đánh dấu là đã có lịch
            _context.StaffTimeSlots.Update(newStaffTimeSlot);
        }

        await _context.SaveChangesAsync(); // Lưu lại tất cả thay đổi

        return Ok("Gán nhân viên thành công");
    }





    [HttpDelete("{userId}/{workShiftId}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> RemoveUserFromWorkShift(int userId, int workShiftId)
    {
        var userWorkShift = await _context.UserWorkShifts
            .FirstOrDefaultAsync(uws => uws.UserId == userId && uws.WorkShiftId == workShiftId);

        if (userWorkShift == null)
            return NotFound(new { message = "UserWorkShift not found." });

        _context.UserWorkShifts.Remove(userWorkShift);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("Approve")]
    //[Authorize(Roles = "admin")]
    public async Task<IActionResult> ApproveUserWorkShift([FromQuery] int userId, [FromQuery] int workShiftId)
    {
        var userWorkShift = await _context.UserWorkShifts
            .FirstOrDefaultAsync(x => x.UserId == userId && x.WorkShiftId == workShiftId);

        if (userWorkShift == null)
            return NotFound(new { message = "Không tìm thấy đăng ký cần duyệt." });

        if (userWorkShift.IsApproved)
            return BadRequest(new { message = "Đăng ký đã được duyệt trước đó." });

        userWorkShift.IsApproved = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã duyệt ca làm thành công." });
    }

    [HttpPost("Register")]
    [Authorize(Roles = "staff,admin")]
    public async Task<IActionResult> RegisterSelfToWorkShift([FromBody] RegisterWorkShiftDTO dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out int userId))
            return BadRequest(new { message = "ID người dùng không hợp lệ." });

        if (User.IsInRole("admin") && dto.UserId != 0)
            userId = dto.UserId;

        var workShift = await _context.WorkShifts.FindAsync(dto.WorkShiftId);
        if (workShift == null)
            return NotFound(new { message = "Ca làm không tồn tại." });

        bool alreadyRegistered = await _context.UserWorkShifts
            .AnyAsync(x => x.UserId == userId && x.WorkShiftId == dto.WorkShiftId);

        if (alreadyRegistered)
            return BadRequest(new { message = "Bạn đã đăng ký ca làm này rồi." });

        var userWorkShift = new UserWorkShift
        {
            UserId = userId,
            WorkShiftId = dto.WorkShiftId,
            RegisteredAt = DateTime.Now,
            IsApproved = User.IsInRole("admin")
        };

        _context.UserWorkShifts.Add(userWorkShift);
        await _context.SaveChangesAsync();

        var baseTimeSlots = await _context.TimeSlots
            .Where(ts => ts.WorkShiftId == dto.WorkShiftId)
            .ToListAsync();

        var existingSlotIds = await _context.StaffTimeSlots
            .Where(st => st.StaffId == userId && baseTimeSlots.Select(ts => ts.Id).Contains(st.TimeSlotId))
            .Select(st => st.TimeSlotId)
            .ToListAsync();

        var newStaffTimeSlots = baseTimeSlots
    .Where(slot => !existingSlotIds.Contains(slot.Id))
    .Select(slot => new StaffTimeSlot
    {
        StaffId = userId,
        TimeSlotId = slot.Id,
        WorkShiftId = dto.WorkShiftId, // ✅ FIX: Thêm khóa ngoại
        RegisteredAt = DateTime.UtcNow,
        IsApproved = User.IsInRole("admin")
    }).ToList();

        _context.StaffTimeSlots.AddRange(newStaffTimeSlots);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = User.IsInRole("admin")
                ? "Đã gán nhân viên vào ca làm và nhân bản time slot thành công."
                : "Đăng ký ca làm thành công. Vui lòng chờ admin duyệt."
        });
    }

    [HttpGet("staff-not-registered/{workShiftId}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<IEnumerable<User>>> GetStaffNotRegisteredForWorkShift(int workShiftId)
    {
        var staffUsers = await _context.Users.Where(u => u.Role == "staff").ToListAsync();
        var registeredIds = await _context.UserWorkShifts
            .Where(uws => uws.WorkShiftId == workShiftId)
            .Select(uws => uws.UserId)
            .ToListAsync();

        var unregistered = staffUsers.Where(u => !registeredIds.Contains(u.Id)).ToList();

        if (!unregistered.Any())
            return NotFound(new { message = "Tất cả nhân viên đã đăng ký ca làm." });

        return Ok(unregistered);
    }

}
