using BookingSalonHair.DTOs;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoriesService _categoriesService;

    public CategoriesController(ICategoriesService categoriesService)
    {
        _categoriesService = categoriesService;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoriesService.GetAllAsync();
        var categoriesDto = categories.Select(c => new CategoryWithServicesDTO
        {
            Id = c.Id,
            Name = c.Name,
            imageurl = c.imgarurl,
            Services = c.Services.Select(s => new ServiceDTO
            {
                Id = s.Id,
                Name = s.Name,
                Price = s.Price,
                Description = s.Description
            }).ToList()
        }).ToList();

        return Ok(categoriesDto);
    }

    // GET: api/categories/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoriesService.GetByIdAsync(id);
        if (category == null)
            return NotFound();

        return Ok(category);
    }

    // POST: api/categories
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryDTO categoryDto)
    {
        if (categoryDto == null || string.IsNullOrEmpty(categoryDto.Name))
        {
            return BadRequest("Dữ liệu không hợp lệ.");
        }

        var category = new Category
        {
            Name = categoryDto.
            imageurl = categoryDto.imageurl
        };

        var createdCategory = await _categoriesService.CreateAsync(category);

        return CreatedAtAction(nameof(GetById), new { id = createdCategory.Id }, createdCategory);
    }

    // PUT: api/categories/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryDTO categoryDto)
    {
        var updatedCategory = await _categoriesService.UpdateAsync(id, new Category
        {
            Name = categoryDto.Name
        });

        if (updatedCategory == null)
            return NotFound();

        return Ok(updatedCategory);
    }

    // DELETE: api/categories/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _categoriesService.DeleteAsync(id);
        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
