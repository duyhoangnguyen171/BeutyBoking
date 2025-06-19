namespace BookingSalonHair.DTOs
{
    public class AddStaffDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Gender { get; set; }
        public string Experience { get; set; }
        public string Address { get; set; }
        public string? imageurl { get; set; }
        public string? Profile { get; set; }
        public DateTime BirthDate { get; set; }
        public string Skills { get; set; }
        public string Password { get; set; } // 👈 Bổ sung
    }

}
