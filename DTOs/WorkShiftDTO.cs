using BookingSalonHair.Models;
using System;

namespace BookingSalonHair.DTOs
{
    public class WorkShiftDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int MaxUsers { get; set; } // Giới hạn số lượng người đăng ký
    }
}
