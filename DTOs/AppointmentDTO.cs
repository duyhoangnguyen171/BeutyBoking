using System;
using BookingSalonHair.Models;
namespace BookingSalonHair.DTOs
{
    public class AppointmentDTO
    {
        private DateTime _appointmentDate;
        public int Id { get; set; }
        //public int? ServiceId { get; set; }
        public List<int>? ServiceIds { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int? CustomerId { get; set; } // Người đặt lịch
        public int? StaffId { get; set; }    // Nhân viên phục vụ // UserId là khách hàng, bạn có thể thay đổi theo trường hợp của mình
        public int? WorkShiftId { get; set; }
        public DateTime AppointmentDate
        {
            get => _appointmentDate;
            set => _appointmentDate = DateTime.SpecifyKind(value.ToUniversalTime(), DateTimeKind.Utc);
        }
        public string Note { get; set; }

        // Thêm trường Status để lưu trạng thái lịch hẹn
        public AppointmentStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
