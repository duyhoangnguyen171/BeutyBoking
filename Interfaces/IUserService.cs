using BookingSalonHair.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingSalonHair.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetAllUsersAsync();
        Task<UserDTO> GetUserByIdAsync(int id);
        Task<UserDTO> UpdateUserAsync(int id, UpdateUserDTO dto);
        Task<bool> DeleteUserAsync(int id);
    }
}
