using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models;
using BookingSalonHair.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BookingSalonHair.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly INewsService _newsService;

        public NewsController(INewsService newsService)
        {
            _newsService = newsService;
        }

        // GET: api/news
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var newsList = await _newsService.GetAllAsync();
            return Ok(newsList);
        }

        // GET: api/news/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var news = await _newsService.GetByIdAsync(id);
            if (news == null)
                return NotFound();

            return Ok(news);
        }

        // POST: api/news
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NewsCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdNews = await _newsService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdNews.Id }, createdNews);
        }

        // PUT: api/news
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] NewsUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != dto.Id)
                return BadRequest("ID trên route và trong body không khớp.");

            var updatedNews = await _newsService.UpdateAsync(dto);
            if (updatedNews == null)
                return NotFound();

            return Ok(updatedNews);
        }

        // DELETE: api/news/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _newsService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
