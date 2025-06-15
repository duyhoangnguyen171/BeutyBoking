using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSalonHair.Migrations
{
    /// <inheritdoc />
    public partial class addprofile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Profile",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Profile",
                table: "Users");
        }
    }
}
