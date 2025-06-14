namespace BookingSalonHair.DTOs
{
    public class OTPVerificationDto
    {
        public string Otp { get; set; }  // Mã OTP mà người dùng nhập vào
        public int AppointmentId { get; set; }
    }
}
