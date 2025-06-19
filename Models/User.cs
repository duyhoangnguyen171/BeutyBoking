using BookingSalonHair.Models;
using System.Text.Json.Serialization;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public string Phone { get; set; }
    public string? Profile { get; set; }
    public string Role { get; set; } = "Customer";
    public bool IsGuest { get; set; } = false;
    public string? imageurl { get; set; }
    public int ReviewCount { get; set; } = 0;

    public string? Gender { get; set; }  // Giới tính
    public string? Experience { get; set; }  // Kinh nghiệm
    public string? Address { get; set; }  // Địa chỉ
    public DateTime? BirthDate { get; set; }  // Ngày sinh
    public string? Skills { get; set; }  // Kỹ năng
    public DateTime? HireDate { get; set; }  // Ngày bắt đầu làm việc của nhân viên
    [JsonIgnore]
    public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
    public ICollection<UserWorkShift> UserWorkShifts { get; set; } = new List<UserWorkShift>();
    public ICollection<Gallery> Galleries { get; set; } = new List<Gallery>();

    // Khách hàng đã đặt lịch
    public ICollection<Appointment> CustomerAppointments { get; set; } = new List<Appointment>();

    // Lịch làm việc của nhân viên
    public ICollection<Appointment> StaffAppointments { get; set; } = new List<Appointment>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public int YearsOfExperience
    {
        get
        {
            if (HireDate.HasValue)
            {
                // Tính số năm kinh nghiệm từ HireDate
                return (int)((DateTime.Now - HireDate.Value).TotalDays / 365);
            }
            return 0;  // Nếu không có HireDate, trả về 0
        }
    }
}
