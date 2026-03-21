using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wishify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPublicToCard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "Cards",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "Cards");
        }
    }
}
