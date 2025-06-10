using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSalonHair.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserWorkShiftRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxUsers",
                table: "WorkShifts",
                type: "int",
                nullable: false,
                defaultValue: 0);

           

            migrationBuilder.CreateTable(
                name: "UserWorkShifts",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    WorkShiftId = table.Column<int>(type: "int", nullable: false),
                    RegisteredAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserWorkShifts", x => new { x.UserId, x.WorkShiftId });
                    table.ForeignKey(
                        name: "FK_UserWorkShifts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserWorkShifts_WorkShifts_WorkShiftId",
                        column: x => x.WorkShiftId,
                        principalTable: "WorkShifts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserWorkShifts_WorkShiftId",
                table: "UserWorkShifts",
                column: "WorkShiftId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserWorkShifts");

            migrationBuilder.DropColumn(
                name: "MaxUsers",
                table: "WorkShifts");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Appointments");
        }
    }
}
