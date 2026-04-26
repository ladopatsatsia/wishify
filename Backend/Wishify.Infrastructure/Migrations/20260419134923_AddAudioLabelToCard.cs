using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wishify.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAudioLabelToCard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AudioLabel",
                table: "Cards",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AudioLabel",
                table: "Cards");
        }
    }
}
