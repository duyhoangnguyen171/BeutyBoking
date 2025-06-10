namespace BookingSalonHair.Models
{
    public class UserWorkShift
    {
        public int UserId { get; set; }
        public User User { get; set; }

        public int WorkShiftId { get; set; }
        public WorkShift WorkShift { get; set; }

        public DateTime RegisteredAt { get; set; } = DateTime.Now;
        public bool IsApproved { get; set; } = false;

    }
}
