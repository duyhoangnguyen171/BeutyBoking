using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
    // Chỉ Admin được phép truy xuất toàn bộ user
    public class UsersController : ControllerBase
    {
        private readonly SalonContext _context;

        public UsersController(SalonContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        [Authorize(Roles = "admin,staff,customer")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            // Lấy ID của người dùng hiện tại từ token
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var currentUserId = int.Parse(userId);

            // Nếu là admin, trả về toàn bộ danh sách người dùng
            if (User.IsInRole("admin"))
            {
                var allUsers = await _context.Users
                    .AsNoTracking()
                    .ToListAsync();
                return Ok(allUsers);
            }

            // Nếu không phải admin, chỉ trả về thông tin của chính người dùng hiện tại
            var currentUser = await _context.Users
                .AsNoTracking()
                .Where(u => u.Id == currentUserId)
                .ToListAsync();

            return Ok(currentUser);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        [Authorize(Roles = "admin,customer,staff")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Lấy ID của người dùng hiện tại từ token
            var currentUserId = int.Parse(userId);

            // Nếu không phải admin, chỉ được xem thông tin của chính mình
            if (!User.IsInRole("admin") && currentUserId != id)
            {
                return Forbid("Bạn không có quyền xem thông tin của người dùng này.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Người dùng không tồn tại");

            return user;
        }

        // PUT: api/Users/5
        [HttpPost("PutUser")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> PutUser(UserDTO userDto)
        {
            var existingUser = await _context.Users.FindAsync(userDto.Id);
            if (existingUser == null)
                return NotFound();

            // Map fields from DTO to entity
            existingUser.FullName = userDto.FullName;
            existingUser.Email = userDto.Email;
            existingUser.Phone = userDto.Phone;
            existingUser.Role = userDto.Role;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log error here if needed
                return StatusCode(500, "Lỗi khi cập nhật người dùng.");
            }

            return NoContent();
        }

        //GET: api/Users/GetStaffs
        [HttpGet("GetStaffs")]
        [AllowAnonymous] // Cho phép truy cập không cần đăng nhập
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetStaffs()
        {
            var staffs = await _context.Users
                .Where(u => u.Role == "staff")
                .Select(s => new UserDTO
                {
                    Id = s.Id,
                    FullName = s.FullName,
                    Email = s.Email,
                    Phone = s.Phone,
                    Role = s.Role,
                    // Thêm các thông tin khác nếu cần
                })
                .ToListAsync();

            return Ok(staffs);
        }
        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            // Xóa các cuộc hẹn liên quan đến user này
            var relatedAppointments = await _context.Appointments
                .Where(a => a.CustomerId == id)
                .ToListAsync();

            _context.Appointments.RemoveRange(relatedAppointments);

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpGet("bookedByStaff/{staffId}")]
        [Authorize(Roles = "staff,admin")] // Cho cả staff và admin
        public async Task<ActionResult<IEnumerable<WorkShift>>> GetWorkShiftsBookedByStaff(int staffId)
        {
            var shifts = await _context.WorkShifts
                .Where(ws => ws.Appointments.Any(a => a.StaffId == staffId))
                .Include(ws => ws.Appointments)
                .ToListAsync();

            return Ok(shifts);
        }
        // tạo user vãng lai
        [HttpPost("guest")]
        public async Task<IActionResult> CreateGuest([FromBody] GuestCustomerDto guestDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Phone == guestDto.Phone);

            if (existingUser != null)
            {
                if (existingUser.IsGuest)
                    return Ok(new { id = existingUser.Id });
                else
                    return Conflict(new { message = "Số điện thoại đã tồn tại cho người dùng đã đăng ký." });
            }

            var guest = new User
            {
                FullName = guestDto.FullName,
                Phone = guestDto.Phone,
                Email = null,
                PasswordHash = null,
                Role = "Customer",
                IsGuest = true
            };

            _context.Users.Add(guest);
            await _context.SaveChangesAsync();

            return Ok(new { id = guest.Id });
        }
        [HttpGet("get-customer-by-phone")]
        public async Task<IActionResult> GetCustomerByPhone([FromQuery] string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return BadRequest("Số điện thoại không hợp lệ.");

            var users = await _context.Users
                .Where(u => u.Phone == phone && u.Role == "Customer")
                .Select(u => new { u.Id, u.FullName })
                .ToListAsync();

            if (!users.Any())
                return NotFound("Không tìm thấy khách hàng với số điện thoại này.");

            return Ok(users);
        }


    }
}
