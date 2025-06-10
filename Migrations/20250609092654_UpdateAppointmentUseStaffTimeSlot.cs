using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSalonHair.Migrations
{
    public partial class UpdateAppointmentUseStaffTimeSlot : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Gỡ FK cũ
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_TimeSlots_TimeSlotId",
                table: "Appointments");

            // Xoá index cũ
            

            // Đổi tên cột
            migrationBuilder.RenameColumn(
                name: "TimeSlotId",
                table: "Appointments",
                newName: "StaffTimeSlotId");

            // Tạo index mới
            migrationBuilder.CreateIndex(
                name: "IX_Appointments_StaffTimeSlotId",
                table: "Appointments",
                column: "StaffTimeSlotId");

            // Thêm foreign key mới
            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_StaffTimeSlots_StaffTimeSlotId",
                table: "Appointments",
                column: "StaffTimeSlotId",
                principalTable: "StaffTimeSlots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Gỡ FK mới
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_StaffTimeSlots_StaffTimeSlotId",
                table: "Appointments");

            // Xoá index mới
            migrationBuilder.DropIndex(
                name: "IX_Appointments_StaffTimeSlotId",
                table: "Appointments");

            // Đổi tên cột lại như cũ
            migrationBuilder.RenameColumn(
                name: "StaffTimeSlotId",
                table: "Appointments",
                newName: "TimeSlotId");

            // Tạo lại index cũ
            migrationBuilder.CreateIndex(
                name: "IX_Appointments_TimeSlotId",
                table: "Appointments",
                column: "TimeSlotId");

            // Thêm lại foreign key cũ
            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_TimeSlots_TimeSlotId",
                table: "Appointments",
                column: "TimeSlotId",
                principalTable: "TimeSlots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
