using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingSalonHair.Services
{
    public class ServiceService : IServiceService
    {
        private readonly SalonContext _context;

        public ServiceService(SalonContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BookingSalonHair.Models.Service>> GetAllServicesAsync()
        {
            return await _context.Services.ToListAsync();
        }

        public async Task<BookingSalonHair.Models.Service> GetServiceByIdAsync(int id)
        {
            return await _context.Services.FindAsync(id);
        }

        public async Task<BookingSalonHair.Models.Service> CreateServiceAsync(BookingSalonHair.Models.Service service)
        {
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<BookingSalonHair.Models.Service> UpdateServiceAsync(int id, BookingSalonHair.Models.Service service)
        {
            var existing = await _context.Services.FindAsync(id);
            if (existing == null) return null;

            existing.Name = service.Name;
            existing.Description = service.Description;
            existing.Price = service.Price;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteServiceAsync(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return false;

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return true;
        }

        Task<IEnumerable<ServiceDTO>> IServiceService.GetAllServicesAsync()
        {
            throw new NotImplementedException();
        }

        Task<ServiceDTO> IServiceService.GetServiceByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceDTO> CreateServiceAsync(ServiceDTO dto)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceDTO> UpdateServiceAsync(int id, ServiceDTO dto)
        {
            throw new NotImplementedException();
        }
    }
}