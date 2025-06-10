namespace BookingSalonHair.DTOs
{
    public class TimeSlotsDto
    {
        public TimeSpan StartTime { get; set; }  // Thời gian bắt đầu
        public TimeSpan EndTime { get; set; }    // Thời gian kết thúc
        public DateTime Date { get; set; } // Ngày của ca làm
        public bool IsAvailable { get; set; }    // Kiểm tra tính khả dụng
        public int WorkShiftId { get; set; }     
    }

}
