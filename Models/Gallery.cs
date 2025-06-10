using SalonBooking.API.Data;
namespace BookingSalonHair.Models
{
    public class Gallery
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }
        
        public int UserId { get; set; }       // Khóa ngoại ✅
        public User User { get; set; }    
    }
}
