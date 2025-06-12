namespace BookingSalonHair.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}
