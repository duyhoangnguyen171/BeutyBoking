namespace BookingSalonHair.Models
{
    public class Banner
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string imageurl { get; set; }
        public string Link { get; set; }  // Đây là nơi lưu trữ URL
        public int Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

}
