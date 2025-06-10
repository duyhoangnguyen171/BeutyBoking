namespace BookingSalonHair.Models
{
    // 1. Tạo lớp EmailSettings để map cấu hình
    public class EmailSettings
    {
        public string FromEmail { get; set; }
        public string Password { get; set; }
        public string SmtpHost { get; set; }
        public int SmtpPort { get; set; }
        public bool EnableSsl { get; set; }
    }

}
