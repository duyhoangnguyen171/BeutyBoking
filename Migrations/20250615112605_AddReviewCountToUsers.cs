using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSalonHair.Migrations
{
    public partial class AddReviewCountToUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Thêm cột ReviewCount vào bảng Users
            migrationBuilder.AddColumn<int>(
                name: "ReviewCount",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Chỉ xóa cột ReviewCount khi rollback migration
            migrationBuilder.DropColumn(
                name: "ReviewCount",
                table: "Users");
        }
    }
}
