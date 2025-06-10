using BookingSalonHair.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingSalonHair.Interfaces
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceDTO>> GetAllServicesAsync();
        Task<ServiceDTO> GetServiceByIdAsync(int id);
        Task<ServiceDTO> CreateServiceAsync(ServiceDTO dto);
        Task<ServiceDTO> UpdateServiceAsync(int id, ServiceDTO dto);
        Task<bool> DeleteServiceAsync(int id);
    }
}
