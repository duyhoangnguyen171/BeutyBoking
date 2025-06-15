using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSalonHair.Migrations
{
    /// <inheritdoc />
    public partial class AddPrimaryKeyToReview : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Đảm bảo 'Id' là primary key của bảng 'Reviews'
            migrationBuilder.AddPrimaryKey(
                name: "PK_Reviews",
                table: "Reviews",
                column: "Id");

            // Nếu cần thiết, có thể thêm các foreign key hoặc mối quan hệ ở đây
            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_AppointmentServices_AppointmentId_ServiceId",
                table: "Reviews",
                columns: new[] { "AppointmentId", "ServiceId" },
                principalTable: "AppointmentServices",
                principalColumns: new[] { "AppointmentId", "ServiceId" },
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Hủy bỏ các thay đổi nếu migration bị revert
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_AppointmentServices_AppointmentId_ServiceId",
                table: "Reviews");

            // Xóa primary key của bảng Reviews nếu cần revert lại
            migrationBuilder.DropPrimaryKey(
                name: "PK_Reviews",
                table: "Reviews");
        }
    }
    }
