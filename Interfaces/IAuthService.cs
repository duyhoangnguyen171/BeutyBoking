using BookingSalonHair.DTOs;
using System.Threading.Tasks;

namespace BookingSalonHair.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDTO model);
        Task<string> LoginAsync(LoginDTO model);
    }
}
