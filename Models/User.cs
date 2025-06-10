using BookingSalonHair.Models;
using System.Text.Json.Serialization;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public string Phone { get; set; }
    public string Role { get; set; } = "Customer";
    public bool IsGuest { get; set; } = false;

    [JsonIgnore]
    public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
    public ICollection<UserWorkShift> UserWorkShifts { get; set; } = new List<UserWorkShift>();
    public ICollection<Gallery> Galleries { get; set; } = new List<Gallery>();

    // Khách hàng đã đặt lịch
    public ICollection<Appointment> CustomerAppointments { get; set; } = new List<Appointment>();

    // Lịch làm việc của nhân viên
    public ICollection<Appointment> StaffAppointments { get; set; } = new List<Appointment>();
}
