namespace BookingSalonHair.DTOs
{
    public class AppointmentHistoryDto
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string StatusText { get; set; }
        public string? Notes { get; set; }
        public string StaffFullName { get; set; }
        public string Date { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public List<string> Services { get; set; } = new();
    }
}
