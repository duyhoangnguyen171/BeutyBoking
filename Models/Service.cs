using SalonBooking.API.Data;
namespace BookingSalonHair.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string[] imageurl { get; set; }
        public ICollection<AppointmentService> AppointmentServices { get; set; } = new List<AppointmentService>();
        public string Description { get; set; }
    }
}
