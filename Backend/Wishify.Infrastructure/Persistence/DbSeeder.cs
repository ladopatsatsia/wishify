using Microsoft.AspNetCore.Identity;
using Wishify.Domain.Entities;
using Wishify.Infrastructure.Persistence;

namespace Wishify.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task Seed(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // 1. Seed Roles
        string[] roleNames = { "Admin", "User" };
        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        // 2. Seed Admin User
        var adminEmail = "admin@wishify.ge";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            var admin = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Admin",
                LastName = "Wishify",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(admin, "adminadmin");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }

        // 3. Seed Categories if missing
        if (!context.Categories.Any())
        {
            var categories = new List<Category>
            {
                new Category { Id = "birthday", Label = "Birthday", Emoji = "🎂", Color = "from-pink-400 to-rose-500" },
                new Category { Id = "invitation", Label = "Invitation", Emoji = "💌", Color = "from-amber-400 to-orange-500" },
                new Category { Id = "memory", Label = "Memory", Emoji = "📸", Color = "from-teal-400 to-cyan-500" },
                new Category { Id = "love", Label = "Love", Emoji = "❤️", Color = "from-red-400 to-pink-500" },
                new Category { Id = "holiday", Label = "Holiday", Emoji = "🎄", Color = "from-green-400 to-emerald-500" },
            };
            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }

        // 4. Seed Templates if missing
        var templates = new List<Template>
        {
            new Template 
            { 
                Id = "b1", 
                CategoryId = "birthday", 
                Title = "Sparkling Celebration", 
                BgGradient = "from-pink-300 via-rose-200 to-yellow-100", 
                DefaultEmoji = "🎉", 
                ThemeColor = "pink",
                DefaultHeading = "Happy Birthday! 🎉",
                DefaultMessage1 = "Today we celebrate you!",
                DefaultMessage2 = "May your day be filled with joy.",
                MusicLabel = "Happy Birthday Beat"
            },
            new Template 
            { 
                Id = "b2", 
                CategoryId = "birthday", 
                Title = "Birthday Reel", 
                BgGradient = "from-slate-900 via-purple-900 to-slate-900", 
                DefaultEmoji = "🎂", 
                ThemeColor = "purple",
                DefaultHeading = "Happy Birthday Reel!",
                DefaultMessage1 = "Swipe up for more birthdays ✨",
                DefaultMessage2 = "You deserve all the happiness today.",
                MusicLabel = "Trending Lo-Fi"
            },
            new Template 
            { 
                Id = "m1", 
                CategoryId = "memory", 
                Title = "Memory Studio", 
                BgGradient = "from-teal-100 via-cyan-50 to-white", 
                DefaultEmoji = "📸", 
                ThemeColor = "teal",
                DefaultHeading = "Our Beautiful Journey",
                DefaultMessage1 = "Capturing every moment together.",
                DefaultMessage2 = "A collection of our favorite memories.",
                MusicLabel = "Acoustic Softness"
            }
        };

        foreach (var template in templates)
        {
            if (!context.Templates.Any(t => t.Id == template.Id))
            {
                context.Templates.Add(template);
            }
        }
        await context.SaveChangesAsync();
    }
}
