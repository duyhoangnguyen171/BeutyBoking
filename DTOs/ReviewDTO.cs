namespace BookingSalonHair.DTOs
{
    public class ReviewDTO
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int ServiceId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime DateCreated { get; set; }
        public int AppointmentServiceId { get; set; }  // Liên kết với AppointmentService
    }
}
