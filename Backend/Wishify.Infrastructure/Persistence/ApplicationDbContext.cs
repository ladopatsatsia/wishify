using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Wishify.Domain.Entities;

namespace Wishify.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Template> Templates { get; set; }
    public DbSet<Card> Cards { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasMany(e => e.Templates)
                .WithOne(e => e.Category)
                .HasForeignKey(e => e.CategoryId);
        });

        builder.Entity<Template>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasMany(e => e.SavedCards)
                .WithOne(e => e.Template)
                .HasForeignKey(e => e.TemplateId);
        });

        builder.Entity<Card>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Creator)
                .WithMany()
                .HasForeignKey(e => e.CreatorId);

            entity.HasIndex(e => e.UrlSlug).IsUnique();
        });
    }
}
