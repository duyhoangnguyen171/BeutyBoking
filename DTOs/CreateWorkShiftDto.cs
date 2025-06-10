namespace BookingSalonHair.DTOs
{
    public class CreateWorkShiftDto
    {
        public string Name { get; set; } // Tên ca làm
        public DayOfWeek DayOfWeek { get; set; } // Ngày trong tuần
        public int MaxUsers { get; set; } // Số người tối đa
        public DateTime Date { get; set; } // Ngày của ca làm
        public string StartTime { get; set; } // Thời gian bắt đầu (dạng chuỗi "HH:mm")
        public string EndTime { get; set; }
    }

    public class TimeSlotDto
    {
        public TimeSpan StartTime { get; set; }  // Thời gian bắt đầu của khung giờ
        public TimeSpan EndTime { get; set; }    // Thời gian kết thúc của khung giờ
    }
}
