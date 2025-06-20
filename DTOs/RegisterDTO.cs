﻿namespace BookingSalonHair.DTOs
{
    public class RegisterDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; }  // "Admin", "Staff", "Customer"
        public bool IsGuest { get; set; }
        public string? ImageUrl { get; set; } // Thêm trường ImageUrl
    }
}