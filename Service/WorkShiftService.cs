using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingSalonHair.Services
{
    public class WorkShiftService : IWorkShiftService
    {
        private readonly SalonContext _context;

        public WorkShiftService(SalonContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WorkShift>> GetAllShiftsAsync()
        {
            return await _context.WorkShifts.ToListAsync();
        }

        public async Task<WorkShift> GetShiftByIdAsync(int id)
        {
            return await _context.WorkShifts.FindAsync(id);
        }

        public async Task<WorkShift> CreateShiftAsync(WorkShift shift)
        {
            _context.WorkShifts.Add(shift);
            await _context.SaveChangesAsync();
            return shift;
        }

        public async Task<WorkShift> UpdateShiftAsync(int id, WorkShift shift)
        {
            var existing = await _context.WorkShifts.FindAsync(id);
            if (existing == null) return null;

            existing.StartTime = shift.StartTime;
            existing.EndTime = shift.EndTime;
            existing.DayOfWeek = shift.DayOfWeek;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteShiftAsync(int id)
        {
            var shift = await _context.WorkShifts.FindAsync(id);
            if (shift == null) return false;

            _context.WorkShifts.Remove(shift);
            await _context.SaveChangesAsync();
            return true;
        }

        public Task<IEnumerable<WorkShiftDTO>> GetAllWorkShiftsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<WorkShiftDTO> GetWorkShiftByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<WorkShiftDTO> CreateWorkShiftAsync(WorkShiftDTO dto)
        {
            throw new NotImplementedException();
        }

        public Task<WorkShiftDTO> UpdateWorkShiftAsync(int id, WorkShiftDTO dto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteWorkShiftAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}