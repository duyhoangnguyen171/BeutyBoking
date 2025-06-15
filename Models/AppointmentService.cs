namespace BookingSalonHair.Models
{
    public class AppointmentService
    {
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; } // Navigation property

        public int ServiceId { get; set; }
        public Service Service { get; set; }
        public int? ReviewId { get; set; } // Liên kết với Review (Đánh giá cho dịch vụ này)
        public Review Review { get; set; } // Mối quan hệ với Review
    }
}
