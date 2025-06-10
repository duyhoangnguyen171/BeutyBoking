using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingSalonHair.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly SalonContext _context;

        public AppointmentService(SalonContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments
                .Include(a => a.Customer)
                .Include(a => a.Staff)
                .Include(a => a.Service)
                .Include(a => a.WorkShift)
                .ToListAsync();
        }

        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments
                .Include(a => a.Customer)
                .Include(a => a.Staff)
                .Include(a => a.Service)
                .Include(a => a.WorkShift)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Appointment> CreateAppointmentAsync(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<bool> CancelAppointmentAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }

        // Phương thức cần triển khai để thay đổi trạng thái lịch hẹn
        public async Task<bool> UpdateAppointmentStatusAsync(int id, Models.AppointmentStatus status)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;

            appointment.Status = status; // Cập nhật trạng thái
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
            return true;
        }

        // Các phương thức còn lại trong interface
        Task<IEnumerable<AppointmentDTO>> IAppointmentService.GetAllAppointmentsAsync()
        {
            throw new NotImplementedException();
        }

        Task<AppointmentDTO> IAppointmentService.GetAppointmentByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<AppointmentDTO> CreateAppointmentAsync(AppointmentDTO dto)
        {
            throw new NotImplementedException();
        }

        public Task<AppointmentDTO> UpdateAppointmentAsync(int id, AppointmentDTO dto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAppointmentAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
