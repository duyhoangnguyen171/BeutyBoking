using BookingSalonHair.DTOs;
using BookingSalonHair.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingSalonHair.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync();
        Task<AppointmentDTO> GetAppointmentByIdAsync(int id);
        Task<AppointmentDTO> CreateAppointmentAsync(AppointmentDTO dto);
        Task<AppointmentDTO> UpdateAppointmentAsync(int id, AppointmentDTO dto);
        Task<bool> DeleteAppointmentAsync(int id);

        // Phương thức để cập nhật trạng thái lịch hẹn
        Task<bool> UpdateAppointmentStatusAsync(int id, AppointmentStatus status);
    }
}
