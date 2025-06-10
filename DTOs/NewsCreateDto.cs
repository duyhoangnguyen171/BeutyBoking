namespace BookingSalonHair.DTOs
{
    public class NewsCreateDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Imageurl { get; set; } // Optional image
    }
    public class NewsUpdateDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Imageurl { get; set; }
    }
}
