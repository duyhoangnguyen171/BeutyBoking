using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookingSalonHair.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;
using System.Security.Claims;
using BookingSalonHair.DTOs;
using BookingSalonHair.Helpers;

namespace BookingSalonHair.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly SalonContext _context;
        private readonly EmailHelper _emailHelper;
       
        public AppointmentsController(SalonContext context, EmailHelper emailHelper)
        {
            _context = context;
            _emailHelper = emailHelper;
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<IActionResult> GetAppointments([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var query = _context.Appointments
                .Where(a => a.CustomerId.ToString() == userId || User.IsInRole("admin") || User.IsInRole("staff"))
                .Include(a => a.Customer)
                .Include(a => a.Staff)
                .Include(a => a.StaffTimeSlot) // ✅ Thay vì TimeSlot
                    .ThenInclude(sts => sts.TimeSlot) // ✅ Lấy ra thời gian cụ thể
                .Include(a => a.AppointmentServices)
                    .ThenInclude(s => s.Service);

            var totalCount = await query.CountAsync();

            var appointments = await query
                .OrderBy(a => a.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    a.Id,
                    a.AppointmentDate,
                    a.CustomerId,
                    a.StaffId,
                    a.Status,
                    a.Notes,
                    CustomerFullName = a.Customer.FullName,
                    StaffFullName = a.Staff.FullName,
                    TimeSlot = new
                    {
                        Date = a.StaffTimeSlot.TimeSlot.Date.ToString("yyyy-MM-dd"),
                        StartTime = a.StaffTimeSlot.TimeSlot.StartTime.ToString(@"hh\:mm"),
                        EndTime = a.StaffTimeSlot.TimeSlot.EndTime.ToString(@"hh\:mm")
                    },
                    AppointmentServices = a.AppointmentServices
                        .Select(s => new
                        {
                            s.ServiceId,
                            ServiceName = s.Service.Name
                        })
                        .ToList()
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            return Ok(new
            {
                Data = appointments,
                TotalCount = totalCount,
                TotalPages = totalPages,
                CurrentPage = page
            });
        }


        // GET: api/Appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var appointment = await _context.Appointments
                .Include(a => a.Customer)
                .Include(a => a.Staff)
                .Include(a => a.AppointmentServices)
                .ThenInclude(a => a.Service)
                .Include(a => a.WorkShift)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound();

            if (appointment.CustomerId.ToString() != userId && !User.IsInRole("admin") && !User.IsInRole("staff"))
                return Forbid();

            return appointment;
        }
        [HttpGet("canceled")]
        [Authorize(Roles = "admin,staff")] // hoặc AllowAnonymous nếu bạn muốn ai cũng xem được
        public async Task<IActionResult> GetCanceledAppointments()
        {
            var appointments = await _context.Appointments
                .Where(a => a.Status == AppointmentStatus.Canceled)
                .Include(a => a.Customer)
                .Include(a => a.Staff)
                .Include(a => a.StaffTimeSlot)
                    .ThenInclude(sts => sts.TimeSlot)
                .Include(a => a.AppointmentServices)
                    .ThenInclude(s => s.Service)
                .Select(a => new
                {
                    a.Id,
                    a.AppointmentDate,
                    a.CustomerId,
                    a.StaffId,
                    a.Status,
                    a.Notes,
                    CustomerFullName = a.Customer.FullName,
                    StaffFullName = a.Staff.FullName,
                    TimeSlot = a.StaffTimeSlot != null ? new
                    {
                        Date = a.StaffTimeSlot.TimeSlot.Date.ToString("yyyy-MM-dd"),
                        StartTime = a.StaffTimeSlot.TimeSlot.StartTime.ToString(@"hh\:mm"),
                        EndTime = a.StaffTimeSlot.TimeSlot.EndTime.ToString(@"hh\:mm")
                    } : null,
                    AppointmentServices = a.AppointmentServices
                        .Select(s => new
                        {
                            s.ServiceId,
                            ServiceName = s.Service.Name
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(appointments);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<Appointment>> PostAppointment(AppointmentServiceCreateDto dto)
        {
            if (dto == null)
                return BadRequest("Dữ liệu không được null.");

            if (dto.ServiceIds == null || !dto.ServiceIds.Any())
                return BadRequest("Phải chọn ít nhất một dịch vụ.");

            if (dto.AppointmentDate <= DateTime.UtcNow)
                return BadRequest("Ngày đặt lịch phải là ngày trong tương lai.");

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (User.IsInRole("customer") && dto.CustomerId?.ToString() != currentUserId)
                return Forbid("Bạn không có quyền đặt lịch cho người khác.");

            var customer = await _context.Users.FindAsync(dto.CustomerId);
            if (customer == null)
                return NotFound("Khách hàng không tồn tại.");

            StaffTimeSlot? staffTimeSlot = null;

            if (dto.StaffId.HasValue)
            {
                var staff = await _context.Users.FindAsync(dto.StaffId.Value);
                if (staff == null)
                    return NotFound("Nhân viên không tồn tại.");

                var isApproved = await _context.UserWorkShifts
                    .AnyAsync(x => x.WorkShiftId == dto.WorkShiftId && x.UserId == dto.StaffId && x.IsApproved);
                if (!isApproved)
                    return BadRequest("Nhân viên chưa đăng ký hoặc chưa được duyệt ca làm này.");

                staffTimeSlot = await _context.StaffTimeSlots
                    .Include(s => s.TimeSlot)
                    .FirstOrDefaultAsync(s =>
                        s.StaffId == dto.StaffId &&
                        s.TimeSlotId == dto.TimeSlotId &&
                        s.WorkShiftId == dto.WorkShiftId &&
                        s.IsApproved);

                if (staffTimeSlot == null)
                    return BadRequest("Khung giờ không tồn tại hoặc chưa được phê duyệt.");

                // Kiểm tra nếu đã đặt rồi
                var isBooked = await _context.Appointments
                    .AnyAsync(a => a.StaffTimeSlotId == staffTimeSlot.Id);
                if (isBooked)
                    return BadRequest("Khung giờ này đã được đặt cho nhân viên.");

                // ❗ Đánh dấu là đã được đặt
                staffTimeSlot.IsAvailable = false;
                _context.StaffTimeSlots.Update(staffTimeSlot);
            }

            var appointment = new Appointment
            {
                AppointmentDate = staffTimeSlot != null
                    ? staffTimeSlot.TimeSlot.Date.Date.Add(staffTimeSlot.TimeSlot.StartTime)
                    : dto.AppointmentDate,
                Notes = dto.Notes,
                CustomerId = dto.CustomerId,
                StaffId = dto.StaffId,
                WorkShiftId = dto.WorkShiftId,
                StaffTimeSlotId = staffTimeSlot?.Id ?? 0,
                Status = Enum.IsDefined(typeof(AppointmentStatus), dto.Status)
                         ? (AppointmentStatus)dto.Status
                         : AppointmentStatus.Accepted,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                AppointmentServices = dto.ServiceIds
                    .Select(id => new AppointmentService { ServiceId = id }).ToList()
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Load các thông tin liên quan
            await _context.Entry(appointment).Reference(a => a.Customer).LoadAsync();
            await _context.Entry(appointment).Reference(a => a.Staff).LoadAsync();
            await _context.Entry(appointment).Reference(a => a.WorkShift).LoadAsync();
            await _context.Entry(appointment).Collection(a => a.AppointmentServices).LoadAsync();
            foreach (var item in appointment.AppointmentServices)
            {
                await _context.Entry(item).Reference(a => a.Service).LoadAsync();
            }

            // Gửi email nếu có
            if (!string.IsNullOrWhiteSpace(customer.Email))
            {
                try
                {
                    await _emailHelper.SendEmailAsync(
                        customer.Email,
                        "Thông báo đặt lịch",
                        $"Xin chào {customer.FullName}, bạn đã đặt lịch hẹn vào lúc {appointment.AppointmentDate:HH:mm dd/MM/yyyy}."
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Lỗi gửi email: {ex.Message}");
                }
            }

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }
        // PUT: api/Appointments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, AppointmentUpdateDto appointment)
        {
            if (id != appointment.Id)
                return BadRequest("ID trong URL không khớp với ID trong payload.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var existingAppointment = await _context.Appointments
                .Include(a => a.AppointmentServices)
                .FirstOrDefaultAsync(a => a.Id == id);
            if (existingAppointment == null)
                return NotFound($"Không tìm thấy lịch hẹn với ID {id}.");

            if (existingAppointment.StaffId.ToString() != userId && !User.IsInRole("admin"))
                return Forbid();

            if (!await _context.Users.AnyAsync(u => u.Id == appointment.CustomerId))
                return NotFound("Khách hàng không tồn tại.");
            if (!await _context.Users.AnyAsync(u => u.Id == appointment.StaffId))
                return NotFound("Nhân viên không tồn tại.");
            if (!await _context.WorkShifts.AnyAsync(w => w.Id == appointment.WorkShiftId))
                return NotFound("Ca làm việc không tồn tại.");
            if (appointment.ServiceIds == null || !appointment.ServiceIds.Any())
                return BadRequest("Phải chọn ít nhất một dịch vụ.");

            var invalidServiceIds = appointment.ServiceIds
                .Where(sid => !_context.Services.Any(s => s.Id == sid)).ToList();
            if (invalidServiceIds.Any())
                return BadRequest($"Dịch vụ không tồn tại: {string.Join(", ", invalidServiceIds)}");

            var staffTimeSlot = await _context.StaffTimeSlots
                .Include(s => s.TimeSlot)
                .FirstOrDefaultAsync(s =>
                    s.StaffId == appointment.StaffId &&
                    s.WorkShiftId == appointment.WorkShiftId &&
                    s.TimeSlotId == appointment.TimeSlotId &&
                    s.IsApproved);
            if (staffTimeSlot == null)
                return BadRequest("Khung giờ không tồn tại hoặc chưa được phê duyệt.");

            var isBooked = await _context.Appointments
                .AnyAsync(a => a.StaffTimeSlotId == staffTimeSlot.Id && a.Id != id && a.Status != AppointmentStatus.Canceled);
            if (isBooked)
                return BadRequest("Khung giờ này đã được đặt.");

            // ✅ Cập nhật
            existingAppointment.AppointmentDate = staffTimeSlot.TimeSlot.Date.Date.Add(staffTimeSlot.TimeSlot.StartTime);
            existingAppointment.CustomerId = appointment.CustomerId;
            existingAppointment.StaffId = appointment.StaffId;
            existingAppointment.WorkShiftId = appointment.WorkShiftId;
            existingAppointment.StaffTimeSlotId = staffTimeSlot.Id;
            existingAppointment.Notes = appointment.Notes;
            existingAppointment.Status = appointment.Status;
            existingAppointment.UpdatedAt = DateTime.UtcNow;

            _context.AppointmentServices.RemoveRange(existingAppointment.AppointmentServices);
            existingAppointment.AppointmentServices = appointment.ServiceIds
                .Select(sid => new AppointmentService { AppointmentId = id, ServiceId = sid })
                .ToList();

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Appointments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.AppointmentServices)
                .Include(a => a.StaffTimeSlot)
                    .ThenInclude(sts => sts.TimeSlot)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound("Lịch hẹn không tồn tại.");

            // ✅ Cập nhật lại trạng thái IsAvailable của TimeSlot
            if (appointment.StaffTimeSlot?.TimeSlot != null)
            {
                appointment.StaffTimeSlot.TimeSlot.IsAvailable = true;
                _context.TimeSlots.Update(appointment.StaffTimeSlot.TimeSlot);
            }

            _context.AppointmentServices.RemoveRange(appointment.AppointmentServices);
            _context.Appointments.Remove(appointment);

            await _context.SaveChangesAsync();
            return NoContent();
        }


        // PUT: api/Appointments/5/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "staff,admin")]
        public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] AppointmentStatusUpdateDto dto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Customer)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (appointment.StaffId.ToString() != userId && !User.IsInRole("admin"))
                return Forbid();

            appointment.Status = dto.Status;
            appointment.UpdatedAt = DateTime.UtcNow;

            _context.Entry(appointment).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var statusText = GetStatusText(appointment.Status);

            if (!string.IsNullOrWhiteSpace(appointment.Customer?.Email))
            {
                try
                {
                    await _emailHelper.SendEmailAsync(
                        appointment.Customer.Email,
                        "Cập nhật trạng thái lịch hẹn",
                        $"Xin chào {appointment.Customer.FullName}, lịch hẹn của bạn vào lúc {appointment.AppointmentDate:HH:mm dd/MM/yyyy} đã được cập nhật trạng thái: **{statusText}**."
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Lỗi gửi email cập nhật trạng thái: {ex.Message}");
                }
            }

            return Ok(new
            {
                message = $"Cập nhật trạng thái thành công: {statusText}",
                newStatus = appointment.Status,
                statusText
            });
        }
        // PUT: api/Appointments/5/cancel
        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "staff,admin,customer")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Customer)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound(new { error = "Lịch hẹn không tồn tại" });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (appointment.CustomerId.ToString() != userId &&
                appointment.StaffId.ToString() != userId &&
                !User.IsInRole("admin"))
                return Forbid("Bạn không có quyền hủy lịch hẹn này");

            appointment.Status = Models.AppointmentStatus.Canceled;
            appointment.UpdatedAt = DateTime.UtcNow;

            _context.Entry(appointment).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            if (!string.IsNullOrWhiteSpace(appointment.Customer?.Email))
            {
                try
                {
                    await _emailHelper.SendEmailAsync(
                        appointment.Customer.Email,
                        "Hủy lịch hẹn",
                        $"Xin chào {appointment.Customer.FullName}, lịch hẹn của bạn vào lúc {appointment.AppointmentDate:HH:mm dd/MM/yyyy} đã được **hủy**."
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Lỗi gửi email hủy lịch: {ex.Message}");
                }
            }

            return Ok(new { message = "Hủy lịch hẹn thành công" });
        }

        private string GetStatusText(AppointmentStatus status)
        {
            return status switch
            {
                AppointmentStatus.Pending => "Đang chờ duyệt",
                AppointmentStatus.Accepted => "Đã xác nhận",
                AppointmentStatus.InProgress => "Đang thực hiện",
                AppointmentStatus.Completed => "Đã hoàn thành",
                AppointmentStatus.Canceled => "Đã hủy",
                _ => "Không xác định"
            };
        }
    }
}
