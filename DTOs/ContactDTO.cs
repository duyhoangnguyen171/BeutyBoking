namespace BookingSalonHair.DTOs
{
    public class ContactDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
        public int UserId { get; set; } // Gửi kèm khi tạo contact
    }
}
