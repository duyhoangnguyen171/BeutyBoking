using SalonBooking.API.Data;
namespace BookingSalonHair.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string[] imageurl { get; set; }
        public int? CategoryId { get; set; }  // ✅ Cho phép null để không ảnh hưởng dữ liệu cũ
        public Category? Category { get; set; }
        public ICollection<AppointmentService> AppointmentServices { get; set; } = new List<AppointmentService>();
        public string Description { get; set; }
        public int Duration { get; set; } // Số phút dịch vụ
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
