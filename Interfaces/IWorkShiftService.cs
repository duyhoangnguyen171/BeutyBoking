using BookingSalonHair.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingSalonHair.Interfaces
{
    public interface IWorkShiftService
    {
        Task<IEnumerable<WorkShiftDTO>> GetAllWorkShiftsAsync();
        Task<WorkShiftDTO> GetWorkShiftByIdAsync(int id);
        Task<WorkShiftDTO> CreateWorkShiftAsync(WorkShiftDTO dto);
        Task<WorkShiftDTO> UpdateWorkShiftAsync(int id, WorkShiftDTO dto);
        Task<bool> DeleteWorkShiftAsync(int id);
    }
}
