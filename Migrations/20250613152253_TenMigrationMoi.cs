using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSalonHair.Migrations
{
    /// <inheritdoc />
    public partial class TenMigrationMoi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVerified",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OTP",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "OtpAttempts",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVerified",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "OTP",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "OtpAttempts",
                table: "Appointments");
        }
    }
}
