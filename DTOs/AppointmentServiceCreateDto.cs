namespace BookingSalonHair.DTOs
{
    public class AppointmentServiceCreateDto
    {
        private DateTime _appointmentDate;

        public DateTime AppointmentDate
        {
            get => _appointmentDate;
            set => _appointmentDate = DateTime.SpecifyKind(value.ToUniversalTime(), DateTimeKind.Utc);
        }

        public string? Notes { get; set; }
        public int? CustomerId { get; set; }
        public int? StaffId { get; set; }
        public int? WorkShiftId { get; set; }
        public int TimeSlotId { get; set; }
        public List<int> ServiceIds { get; set; } = new();
        public int Status { get; set; }
    }
    
}
