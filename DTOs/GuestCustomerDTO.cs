using System.ComponentModel.DataAnnotations;

namespace BookingSalonHair.DTOs
{
    public class GuestCustomerDto
    {
        [Required(ErrorMessage = "Tên không được để trống")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Phone { get; set; }
        public string? Email { get; set; }
    }

}
