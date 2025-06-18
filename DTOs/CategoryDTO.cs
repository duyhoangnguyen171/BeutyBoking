namespace BookingSalonHair.DTOs
{
    public class CategoryDTO
    {
        public string Name { get; set; }
        public string imageurl { get; set; }
        public List<ServiceDTO>? Services { get; set; }   // Dịch vụ thuộc danh mục
    }
}
