namespace BookingSalonHair.Models
{
    public class StaffTimeSlot
    {
        public int Id { get; set; }

        public int StaffId { get; set; }
        public User Staff { get; set; }

        public int TimeSlotId { get; set; }
        public TimeSlot TimeSlot { get; set; }

        public int WorkShiftId { get; set; }
        public WorkShift WorkShift { get; set; }
        public bool IsAvailable { get; set; } = true;
        public bool IsBooked { get; set; } = true;
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
        public bool IsApproved { get; set; } = false;
    }
}