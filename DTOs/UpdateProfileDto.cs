namespace BookingSalonHair.DTOs
{
    public class UpdateProfileDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? imageurl { get; set; }

        // Nếu người dùng muốn đổi mật khẩu
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}
