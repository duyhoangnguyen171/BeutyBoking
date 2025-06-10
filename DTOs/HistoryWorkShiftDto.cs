using BookingSalonHair.Models;

namespace BookingSalonHair.DTOs
{
    public class HistoryWorkShiftDto
    {
        public string Name { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public DateTime Date { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public int MaxUsers { get; set; }
        public ICollection<TimeSlot> TimeSlots { get; set; }
    }
}
