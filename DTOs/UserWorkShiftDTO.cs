namespace BookingSalonHair.DTOs
{
    public class UserWorkShiftDTO
    {
        public int UserId { get; set; }
        public int WorkShiftId { get; set; }
        public DateTime RegisteredAt { get; set; } = DateTime.Now;
    }
}
