using System.Collections.Generic;
using System.Linq;
using ServiceModel = BookingSalonHair.Models.Service;
using System.Threading.Tasks;
using BookingSalonHair.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonBooking.API.Data;

namespace BookingSalonHair.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly SalonContext _context;

        public ServicesController(SalonContext context)
        {
            _context = context;
        }

        // GET: api/Services
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ServiceModel>>> GetServices()
        {
            return await _context.Services.ToListAsync();
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ServiceModel>> GetService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return NotFound();
            return service;
        }

        // POST: api/Services
        [HttpPost]
        [Authorize(Roles = "admin,staff")]
        public async Task<ActionResult<ServiceModel>> PostService(ServiceModel service)
        {
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetService), new { id = service.Id }, service);
        }

        // PUT: api/Services/5
        [HttpPut("{id}")]
        [Authorize(Roles = "admin,staff")]
        public async Task<IActionResult> PutService(int id, ServiceModel service)
        {
            if (id != service.Id)
                return BadRequest();

            _context.Entry(service).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Services.Any(e => e.Id == id))
                    return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return NotFound();

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
