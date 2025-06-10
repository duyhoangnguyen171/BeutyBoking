using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookingSalonHair.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(ContactDto dto)
        {
            var contact = await _contactService.CreateAsync(dto);
            return Ok(contact);
        }

        [HttpGet]
        [Authorize(Roles = "admin,staff")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _contactService.GetAllAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin,staff")]
        public async Task<IActionResult> GetById(int id)
        {
            var contact = await _contactService.GetByIdAsync(id);
            if (contact == null) return NotFound();
            return Ok(contact);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _contactService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }

}
