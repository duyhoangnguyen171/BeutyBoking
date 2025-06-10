namespace BookingSalonHair.DTOs
{
    public class RegisterStaffTimeSlotDto
    {
        public int StaffId { get; set; }  // Optional if using token
        public int TimeSlotId { get; set; }
        public int WorkShiftId { get; set; }
    }
}
