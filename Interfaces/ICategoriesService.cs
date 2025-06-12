namespace BookingSalonHair.Interfaces
{
    using BookingSalonHair.Models;

    public interface ICategoriesService
    {
        Task<List<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(int id);
        Task<Category> CreateAsync(Category category);
        Task<Category?> UpdateAsync(int id, Category updated);
        Task<bool> DeleteAsync(int id);
    }
}
