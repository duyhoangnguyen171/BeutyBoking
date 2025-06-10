using SalonBooking.API.Data;
using System.Text.Json.Serialization;
namespace BookingSalonHair.Models
{
    //public class Contact
    //{
    //    public int Id { get; set; }
    //    public string Name { get; set; }
    //    public string Email { get; set; }
    //    public string Message { get; set; }
    //    public DateTime CreatedAt { get; set; }
    //    public  User User{ get;  set; }
    //    public int UserId { get; set; }  // khóa ngoại
    //}
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }

        // Đánh dấu [JsonIgnore] để ngừng serialize User trong Contact
        [JsonIgnore]
        public User User { get; set; }

        public int UserId { get; set; }  // khóa ngoại
    }

}
