using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSalonHair.Migrations
{
    /// <inheritdoc />
    public partial class addHistoryworkshift : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HistoryWorkShiftId",
                table: "TimeSlots",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "HistoryWorkShifts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    MaxUsers = table.Column<int>(type: "int", nullable: false),
                    IsArchived = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistoryWorkShifts", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TimeSlots_HistoryWorkShiftId",
                table: "TimeSlots",
                column: "HistoryWorkShiftId");

            migrationBuilder.AddForeignKey(
                name: "FK_TimeSlots_HistoryWorkShifts_HistoryWorkShiftId",
                table: "TimeSlots",
                column: "HistoryWorkShiftId",
                principalTable: "HistoryWorkShifts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TimeSlots_HistoryWorkShifts_HistoryWorkShiftId",
                table: "TimeSlots");

            migrationBuilder.DropTable(
                name: "HistoryWorkShifts");

            migrationBuilder.DropIndex(
                name: "IX_TimeSlots_HistoryWorkShiftId",
                table: "TimeSlots");

            migrationBuilder.DropColumn(
                name: "HistoryWorkShiftId",
                table: "TimeSlots");
        }
    }
}
