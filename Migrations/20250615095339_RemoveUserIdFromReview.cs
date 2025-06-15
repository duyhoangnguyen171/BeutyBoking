using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSalonHair.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserIdFromReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Xóa Foreign Key
            migrationBuilder.CreateIndex(
       name: "IX_Reviews_CustomerId",
       table: "Reviews",
       column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Users_CustomerId",
                table: "Reviews",
                column: "CustomerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Thêm lại cột UserId
            migrationBuilder.DropForeignKey(name: "FK_Reviews_Users_CustomerId", table: "Reviews");
            migrationBuilder.DropIndex(name: "IX_Reviews_CustomerId", table: "Reviews");
        }
    }
}
