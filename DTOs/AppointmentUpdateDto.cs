using System.Collections.Generic;
using BookingSalonHair.Models;

namespace BookingSalonHair.DTOs
{
    public class AppointmentUpdateDto
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public int CustomerId { get; set; }
        public int? StaffId { get; set; }
        public List<int> ServiceIds { get; set; }
        public int? WorkShiftId { get; set; }
        public int TimeSlotId { get; set; } // BỔ SUNG DÒNG NÀY
        public string Notes { get; set; }
        public BookingSalonHair.Models.AppointmentStatus Status { get; set; }
    }
}