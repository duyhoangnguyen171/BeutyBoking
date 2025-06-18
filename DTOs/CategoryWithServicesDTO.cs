namespace BookingSalonHair.DTOs
{
    public class CategoryWithServicesDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string imageurl { get; set; }
        public List<ServiceDTO> Services { get; set; } = new List<ServiceDTO>();
    }

    public class ServiceCategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
    }
}
