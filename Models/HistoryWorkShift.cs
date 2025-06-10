namespace BookingSalonHair.Models
{
    public class HistoryWorkShift
    {
        public int Id { get; set; }
        public string Name { get; set; } // Tên ca làm (ví dụ: "Ca sáng", "Ca chiều")
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public DateTime Date { get; set; } // Ngày của ca làm
        public DayOfWeek DayOfWeek { get; set; }
        public int MaxUsers { get; set; }
        public bool IsArchived { get; set; } // Đánh dấu ca làm đã được lưu trữ vào lịch sử

        public ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();

    }
}