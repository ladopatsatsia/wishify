using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wishify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddExtraCardFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GiftBoxUrl",
                table: "Cards",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImagesJson",
                table: "Cards",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GiftBoxUrl",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImagesJson",
                table: "Cards");
        }
    }
}
