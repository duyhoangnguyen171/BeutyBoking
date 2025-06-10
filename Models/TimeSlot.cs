namespace BookingSalonHair.Models
{
    public class TimeSlot
    {
        public int Id { get; set; }
        public TimeSpan StartTime { get; set; }  // Thời gian bắt đầu của khung giờ
        public DateTime Date { get; set; } // Ngày của ca làm
        public TimeSpan EndTime { get; set; }    // Thời gian kết thúc của khung giờ
        public bool IsAvailable { get; set; }    // Kiểm tra khung giờ còn trống hay không
        public int WorkShiftId { get; set; }
        public WorkShift WorkShift { get; set; } // Liên kết với WorkShift
    }

}
