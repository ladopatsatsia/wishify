using Wishify.Domain.Entities;
using Wishify.Infrastructure.Persistence;

namespace Wishify.Infrastructure.Persistence;

public static class DbSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        // Clean up any extra birthday templates that should not exist
        var extraIds = new[] { "b2", "b3", "b4" };
        var extras = context.Templates.Where(t => extraIds.Contains(t.Id)).ToList();
        if (extras.Any())
        {
            context.Templates.RemoveRange(extras);
            context.SaveChanges();
        }

        if (context.Categories.Any()) return;

        var categories = new List<Category>
        {
            new Category { Id = "birthday", Label = "Birthday", Emoji = "🎂", Color = "from-pink-400 to-rose-500" },
            new Category { Id = "graduation", Label = "Graduation", Emoji = "🎓", Color = "from-violet-400 to-purple-600" },
            new Category { Id = "invitation", Label = "Invitation", Emoji = "💌", Color = "from-amber-400 to-orange-500" },
            new Category { Id = "memory", Label = "Memory", Emoji = "📸", Color = "from-teal-400 to-cyan-500" },
            new Category { Id = "love", Label = "Love", Emoji = "❤️", Color = "from-red-400 to-pink-500" },
            new Category { Id = "holiday", Label = "Holiday", Emoji = "🎄", Color = "from-green-400 to-emerald-500" },
        };

        context.Categories.AddRange(categories);

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
                Id = "g1", 
                CategoryId = "graduation", 
                Title = "Triumphant Cap", 
                BgGradient = "from-violet-300 via-purple-200 to-indigo-100", 
                DefaultEmoji = "🎓", 
                ThemeColor = "violet",
                DefaultHeading = "Congrats! 🎓",
                DefaultMessage1 = "You did it!",
                DefaultMessage2 = "The future looks bright.",
                MusicLabel = "Success March"
            }
        };

        context.Templates.AddRange(templates);
        context.SaveChanges();
    }
}
