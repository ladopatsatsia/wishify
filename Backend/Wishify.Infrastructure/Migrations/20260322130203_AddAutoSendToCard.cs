using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wishify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAutoSendToCard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AutoSendRecipient",
                table: "Cards",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAutoSend",
                table: "Cards",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSent",
                table: "Cards",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ScheduledDate",
                table: "Cards",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ScheduledTime",
                table: "Cards",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SendMethod",
                table: "Cards",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AutoSendRecipient",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "IsAutoSend",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "IsSent",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ScheduledDate",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ScheduledTime",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "SendMethod",
                table: "Cards");
        }
    }
}
