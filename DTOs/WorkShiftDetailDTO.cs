using BookingSalonHair.Models;
using System;
using System.Collections.Generic;

namespace BookingSalonHair.DTOs
{
    public class WorkShiftDetailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int MaxUsers { get; set; }

        public List<WorkShiftAppointmentDTO> Appointments { get; set; } = new();
        public List<SimpleUserDTO> RegisteredStaffs { get; set; } = new();
    }

    public class WorkShiftAppointmentDTO
    {
        public int Id { get; set; }
        public int? ServiceId { get; set; }
        public string? CustomerName { get; set; }
        public int? StaffId { get; set; }
        public string? StaffName { get; set; }
    }

    public class SimpleUserDTO
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public bool IsApproved { get; set; }
    }
}
