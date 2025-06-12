namespace BookingSalonHair.DTOs
{
    public class UpdateWorkShiftDto
    {
        public int Id { get; set; } // Trường bắt buộc cho việc cập nhật
        public string Name { get; set; } // Tên ca làm (có thể cập nhật)
        public int MaxUsers { get; set; } // Số lượng người tối đa (có thể cập nhật)
        public string StartTime { get; set; } // Thời gian bắt đầu (có thể cập nhật)
        public string EndTime { get; set; } // Thời gian kết thúc (có thể cập nhật)
        public DateTime Date { get; set; }
    }
}
