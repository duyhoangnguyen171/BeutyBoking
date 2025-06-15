namespace BookingSalonHair.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int CustomerId { get; set; } // Liên kết với người dùng (khách hàng)
        public User Customer { get; set; }
        public int ServiceId { get; set; } // Liên kết với dịch vụ
        public Service Service { get; set; }

        public int Rating { get; set; } // Điểm đánh giá (1-5 sao)
        public string Comment { get; set; } // Nhận xét chi tiết từ khách hàng
        public DateTime DateCreated { get; set; } // Ngày đánh giá

        // Liên kết với AppointmentService
        public int? AppointmentId { get; set; }  // Liên kết với AppointmentId trong AppointmentService
        public AppointmentService AppointmentService { get; set; }  // Mối quan hệ với AppointmentService
    }
}
