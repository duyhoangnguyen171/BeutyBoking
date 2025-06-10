// ✅ Final version of WorkShiftsController (refactored to use StaffTimeSlots)

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public class WorkShiftsController : ControllerBase
    {
        private readonly SalonContext _context;

        public WorkShiftsController(SalonContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "admin,staff,customer")]
        public async Task<ActionResult<IEnumerable<WorkShift>>> GetWorkShifts()
        {
            var workShifts = await _context.WorkShifts.AsNoTracking().ToListAsync();
            return Ok(workShifts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkShift(int id)
        {
            var shift = await _context.WorkShifts.AsNoTracking()
                .Where(w => w.Id == id)
                .Select(w => new
                {
                    WorkShift = w,
                    Appointments = w.Appointments.Select(a => new
                    {
                        a.Id,
                        a.ServiceId,
                        a.StaffId,
                        CustomerName = a.Customer.FullName,
                        StaffName = a.Staff.FullName
                    }),
                    RegisteredStaffs = w.UserWorkShifts.Select(uw => new
                    {
                        uw.User.Id,
                        uw.User.FullName,
                        uw.IsApproved
                    })
                })
                .FirstOrDefaultAsync();

            if (shift == null) return NotFound();

            var result = new WorkShiftDetailDTO
            {
                Id = shift.WorkShift.Id,
                Name = shift.WorkShift.Name,
                StartTime = shift.WorkShift.StartTime,
                EndTime = shift.WorkShift.EndTime,
                MaxUsers = shift.WorkShift.MaxUsers,
                Appointments = shift.Appointments.Select(a => new WorkShiftAppointmentDTO
                {
                    Id = a.Id,
                    ServiceId = a.ServiceId,
                    CustomerName = a.CustomerName,
                    StaffId = a.StaffId,
                    StaffName = a.StaffName
                }).ToList(),
                RegisteredStaffs = shift.RegisteredStaffs.Select(u => new SimpleUserDTO
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    IsApproved = u.IsApproved
                }).ToList()
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<WorkShift>> PostWorkShift(WorkShift workShift)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.WorkShifts.Add(workShift);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorkShift), new { id = workShift.Id }, workShift);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> PutWorkShift(int id, WorkShift workShift)
        {
            // Kiểm tra ID từ URL và body có khớp không
            if (id != workShift.Id)
                return BadRequest("ID không khớp.");

            // Kiểm tra các trường bắt buộc và hợp lệ
            if (string.IsNullOrWhiteSpace(workShift.Name))
            {
                return BadRequest("Tên ca làm không được để trống.");
            }

            if (workShift.MaxUsers <= 0)
            {
                return BadRequest("Số lượng người tối đa phải lớn hơn 0.");
            }

            // Loại bỏ các trường không cần thiết (nếu có)
            workShift.Appointments = null; // Hoặc có thể giữ nếu cần
            workShift.UserWorkShifts = null; // Hoặc có thể giữ nếu cần

            _context.Entry(workShift).State = EntityState.Modified;

            try
            {
                // Lưu thay đổi
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Xử lý khi ca làm không tồn tại
                if (!await _context.WorkShifts.AnyAsync(w => w.Id == id))
                    return NotFound("Ca làm không tồn tại.");

                throw;
            }

            // Trả về NoContent khi cập nhật thành công
            return NoContent();
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteWorkShift(int id)
        {
            var workShift = await _context.WorkShifts.FindAsync(id);
            if (workShift == null) return NotFound();

            _context.WorkShifts.Remove(workShift);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("with-time-slots")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<WorkShift>> CreateWorkShiftWithTimeSlots([FromBody] CreateWorkShiftDto dto)
        {
            DateTime selectedDate = dto.Date;
            DayOfWeek dayOfWeekEnum = selectedDate.DayOfWeek;

            var existingWorkShift = await _context.WorkShifts.FirstOrDefaultAsync(ws =>
                ws.Date == selectedDate &&
                ws.StartTime == TimeSpan.Parse(dto.StartTime) &&
                ws.EndTime == TimeSpan.Parse(dto.EndTime));

            if (existingWorkShift != null)
                return BadRequest(new { message = "Ca làm việc đã tồn tại vào ngày và giờ này." });

            var workShift = new WorkShift
            {
                Name = dto.Name,
                DayOfWeek = dayOfWeekEnum,
                MaxUsers = dto.MaxUsers,
                StartTime = TimeSpan.Parse(dto.StartTime),
                EndTime = TimeSpan.Parse(dto.EndTime),
                Date = selectedDate
            };

            var timeSlots = new List<TimeSlot>();
            for (var time = workShift.StartTime; time < workShift.EndTime; time = time.Add(TimeSpan.FromMinutes(30)))
            {
                timeSlots.Add(new TimeSlot
                {
                    StartTime = time,
                    EndTime = time.Add(TimeSpan.FromMinutes(30)),
                    IsAvailable = true,
                    WorkShift = workShift,
                    Date = selectedDate
                });
            }

            _context.WorkShifts.Add(workShift);
            await _context.SaveChangesAsync();

            foreach (var slot in timeSlots)
            {
                slot.WorkShiftId = workShift.Id;
            }

            _context.TimeSlots.AddRange(timeSlots);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã tạo ca làm việc vào ngày {selectedDate:dd/MM/yyyy}", workShift });
        }

        [HttpGet("GetStaffByDate/{date}")]
        public async Task<ActionResult<IEnumerable<User>>> GetStaffByDate(DateTime date)
        {
            var staffWorkShifts = await _context.UserWorkShifts
                .Where(uws => uws.WorkShift.Date.Date == date.Date)
                .Include(uws => uws.User)
                .ToListAsync();

            if (!staffWorkShifts.Any())
                return NotFound(new { message = "Không có nhân viên đăng ký làm vào ngày này." });

            return Ok(staffWorkShifts.Select(uws => uws.User).ToList());
        }
        // hàm lấy time ca làm của nhân viên
        [HttpGet("GetAvailableTimeSlots/{staffId}/{date}")]
        public async Task<ActionResult<IEnumerable<TimeSlot>>> GetAvailableTimeSlots(int staffId, DateTime date)
        {
            var timeSlots = await _context.StaffTimeSlots
                .Include(sts => sts.TimeSlot)
                .Where(sts => sts.StaffId == staffId && sts.TimeSlot.Date.Date == date.Date && sts.TimeSlot.IsAvailable)
                .Select(sts => sts.TimeSlot)
                .ToListAsync();

            if (!timeSlots.Any())
            {
                return NotFound(new { message = "Không có thời gian làm việc còn trống cho nhân viên này vào ngày này." });
            }

            return Ok(timeSlots);
        }
        [HttpGet("GetWorkShiftId")]
        public async Task<IActionResult> GetWorkShiftId(int staffId, string date)
        {
            if (!DateTime.TryParse(date, out var parsedDate))
                return BadRequest("Ngày không hợp lệ.");

            var workShift = await _context.UserWorkShifts
                .Include(uws => uws.WorkShift)
                .Where(uws => uws.UserId == staffId && uws.WorkShift.Date.Date == parsedDate.Date)
                .Select(uws => uws.WorkShift)
                .FirstOrDefaultAsync();

            if (workShift == null)
                return NotFound(new { message = "Không tìm thấy ca làm." });

            return Ok(new { workShiftId = workShift.Id });
        }
        [HttpPost("move-to-history/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> MoveToHistory(int id)
        {
            var workShift = await _context.WorkShifts
                                          .Include(ws => ws.TimeSlots)  // Bao gồm các TimeSlots liên quan
                                          .FirstOrDefaultAsync(ws => ws.Id == id);

            if (workShift == null)
                return NotFound(new { message = "Ca làm không tồn tại." });

            // Sao chép dữ liệu từ WorkShift vào HistoryWorkShift
            var historyWorkShift = new HistoryWorkShift
            {
                Name = workShift.Name,
                StartTime = workShift.StartTime,
                EndTime = workShift.EndTime,
                Date = workShift.Date,
                DayOfWeek = workShift.DayOfWeek,
                MaxUsers = workShift.MaxUsers,
                TimeSlots = new List<TimeSlot>(workShift.TimeSlots), // Sao chép các TimeSlots
                IsArchived = true  // Đánh dấu là đã chuyển vào lịch sử
            };

            // Lưu vào bảng HistoryWorkShifts
            _context.HistoryWorkShifts.Add(historyWorkShift);

            // Xóa các TimeSlot liên kết
            _context.TimeSlots.RemoveRange(workShift.TimeSlots);

            // Xóa WorkShift
            _context.WorkShifts.Remove(workShift);

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            return NoContent();  // Trả về thành công
        }
        [HttpGet("history")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetHistory()
        {
            try
            {
                // Lấy tất cả các ca làm đã chuyển vào lịch sử từ bảng HistoryWorkShifts
                var historyWorkShifts = await _context.HistoryWorkShifts
                                                       .Select(ws => new
                                                       {
                                                           ws.Id,
                                                           ws.Name,
                                                           ws.StartTime,
                                                           ws.EndTime,
                                                           ws.Date,
                                                           ws.DayOfWeek,
                                                           ws.MaxUsers,
                                                           ws.IsArchived
                                                       })
                                                       .ToListAsync();

                // Kiểm tra nếu không có dữ liệu lịch sử
                if (historyWorkShifts == null || !historyWorkShifts.Any())
                {
                    return NotFound(new { message = "Không có ca làm nào trong lịch sử." });
                }

                // Trả về danh sách các ca làm trong lịch sử
                return Ok(historyWorkShifts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy lịch sử ca làm.", details = ex.Message });
            }
        }
    }
}