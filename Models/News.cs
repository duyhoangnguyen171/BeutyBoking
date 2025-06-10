namespace BookingSalonHair.Models
{
    public class News
    {
        public int Id { get; set; }
        public string Title { get; set; } // Title of the news
        public string Content { get; set; } // Full content of the news article
        public string imageurl { get; set; } // Optional URL for an image
        public DateTime CreatedAt { get; set; } // When the news was created
        public DateTime UpdatedAt { get; set; } // When the news was last updated
    }
}
