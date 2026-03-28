using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wishify.Domain.Entities;
using Wishify.Infrastructure.Persistence;

namespace Wishify.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public AdminController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        var userList = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userList.Add(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.CreatedAt,
                Role = roles.FirstOrDefault() ?? "User"
            });
        }

        return Ok(userList);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalUsers = await _userManager.Users.CountAsync();
        var totalCards = await _context.Cards.CountAsync();
        var publicCards = await _context.Cards.CountAsync(c => !string.IsNullOrEmpty(c.UrlSlug));
        var categoriesCount = await _context.Categories.CountAsync();

        // 1. Daily Activity (Last 7 Days)
        var last7Days = Enumerable.Range(0, 7)
            .Select(i => DateTime.UtcNow.Date.AddDays(-i))
            .OrderBy(d => d)
            .ToList();

        var dailyActivity = new List<object>();
        foreach (var date in last7Days)
        {
            var count = await _context.Cards
                .CountAsync(c => c.CreatedAt.Date == date);
            dailyActivity.Add(new { Date = date.ToString("MMM dd"), Count = count });
        }

        // 2. Recent Activity Logs (Last 5 Registrations)
        var recentLogs = await _userManager.Users
            .OrderByDescending(u => u.CreatedAt)
            .Take(5)
            .Select(u => new
            {
                User = $"{u.FirstName} {u.LastName}",
                Action = "Joined the platform",
                Time = u.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            TotalUsers = totalUsers,
            TotalCards = totalCards,
            PublicCards = publicCards,
            CategoriesCount = categoriesCount,
            DailyActivity = dailyActivity,
            RecentLogs = recentLogs
        });
    }

    [HttpGet("cards")]
    public async Task<IActionResult> GetAllCards()
    {
        var cards = await _context.Cards
            .Include(c => c.Creator)
            .Include(c => c.Template)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.Heading,
                c.RecipientName,
                c.IsPublic,
                c.UrlSlug,
                c.CreatedAt,
                Creator = c.Creator != null ? $"{c.Creator.FirstName} {c.Creator.LastName}" : "Anonymous",
                TemplateTitle = c.Template != null ? c.Template.Title : "Custom"
            })
            .ToListAsync();

        return Ok(cards);
    }

    [HttpGet("templates")]
    public async Task<IActionResult> GetAllTemplates()
    {
        var templates = await _context.Templates
            .Include(t => t.Category)
            .Select(t => new
            {
                t.Id,
                t.Title,
                Category = t.Category != null ? t.Category.Label : "Uncategorized",
                UsageCount = _context.Cards.Count(c => c.TemplateId == t.Id)
            })
            .ToListAsync();

        return Ok(templates);
    }

    [HttpDelete("users/{userId}")]
    public async Task<IActionResult> DeleteUser(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound();

        // Don't allow deleting yourself
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == userId) return BadRequest("You cannot delete your own admin account.");

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok(new { message = "User deleted successfully" });
    }
}
