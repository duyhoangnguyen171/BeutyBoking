namespace BookingSalonHair.Models
{
    public class WorkShift
    {
        public int Id { get; set; }
        public string Name { get; set; } // Ví dụ: "Ca sáng", "Ca chiều"
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public DateTime Date { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public int MaxUsers { get; set; } // Giới hạn số lượng người đăng ký
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>(); // Các cuộc hẹn trong ca làm việc này
   
        public ICollection<UserWorkShift> UserWorkShifts { get; set; }

        // Thêm một danh sách các khung giờ (TimeSlots) cho ca làm việc
        public ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();
    }

    

}

