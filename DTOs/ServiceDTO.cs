namespace BookingSalonHair.DTOs
{
    public class ServiceDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }
        public string Description { get; set; } // ✅ Thêm mô tả
        public List<AppointmentServiceCreateDto>? AppointmentServices { get; set; } // Nullable, có thể không truyền giá trị
    }
}