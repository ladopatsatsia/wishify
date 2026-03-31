using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wishify.Application.Interfaces;
using Wishify.Domain.Entities;
using Wishify.Infrastructure.Persistence;

namespace Wishify.Infrastructure.Services;

public class TemplateService : ITemplateService
{
    private readonly ApplicationDbContext _context;

    public TemplateService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetCategoriesAsync()
    {
        return await _context.Categories.Include(c => c.Templates).ToListAsync();
    }

    public async Task<IEnumerable<Template>> GetTemplatesByCategoryAsync(string categoryId)
    {
        return await _context.Templates.Where(t => t.CategoryId == categoryId).ToListAsync();
    }

    public async Task<Template?> GetTemplateByIdAsync(string templateId)
    {
        return await _context.Templates.AsNoTracking().FirstOrDefaultAsync(t => t.Id == templateId);
    }

    public async Task<IEnumerable<Template>> GetAllTemplatesAsync()
    {
        return await _context.Templates.AsNoTracking().ToListAsync();
    }
}

public class CardService : ICardService
{
    private readonly ApplicationDbContext _context;

    public CardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Card?> CreateCardAsync(Card card)
    {
        _context.Cards.Add(card);
        await _context.SaveChangesAsync();
        return card;
    }

    public async Task<Card?> GetCardByIdAsync(Guid cardId)
    {
        return await _context.Cards
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == cardId);
    }

    public async Task<IEnumerable<Card>> GetUserCardsAsync(string userId)
    {
        // Optimization: For the dashboard list view, we EXCLUDE the massive ImagesJson column
        // which can be ~12MB per card. We project to a new Card object but keep the heavy field null.
        return await _context.Cards
            .AsNoTracking()
            .Where(c => c.CreatorId == userId)
            .Select(c => new Card
            {
                Id = c.Id,
                TemplateId = c.TemplateId,
                CreatorId = c.CreatorId,
                RecipientName = c.RecipientName,
                Heading = c.Heading,
                Message1 = c.Message1,
                Message2 = c.Message2,
                Footer = c.Footer,
                AudioUrl = c.AudioUrl,
                CustomEmoji = c.CustomEmoji,
                CustomBgGradient = c.CustomBgGradient,
                GiftBoxUrl = c.GiftBoxUrl,
                ImagesJson = null, // Skip the heavy data!
                IsPublic = c.IsPublic,
                UrlSlug = c.UrlSlug,
                IsPaid = c.IsPaid,
                IsAutoSend = c.IsAutoSend,
                AutoSendRecipient = c.AutoSendRecipient,
                ScheduledDate = c.ScheduledDate,
                ScheduledTime = c.ScheduledTime,
                SendMethod = c.SendMethod,
                IsSent = c.IsSent,
                CreatedAt = c.CreatedAt
            })
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> DeleteCardAsync(Guid cardId, string userId)
    {
        var card = await _context.Cards.FirstOrDefaultAsync(c => c.Id == cardId && c.CreatorId == userId);
        if (card == null) return false;

        _context.Cards.Remove(card);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleCardPublicAsync(Guid cardId, string userId)
    {
        var card = await _context.Cards.FirstOrDefaultAsync(c => c.Id == cardId && c.CreatorId == userId);
        if (card == null) return false;

        card.IsPublic = !card.IsPublic;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> PublishCardAsync(Guid cardId, string userId, string slug)
    {
        var card = await _context.Cards.FirstOrDefaultAsync(c => c.Id == cardId && c.CreatorId == userId);
        if (card == null) return false;

        // Check if slug is already taken (only for public cards)
        var slugExists = await _context.Cards.AnyAsync(c => c.UrlSlug == slug && c.Id != cardId);
        if (slugExists) throw new InvalidOperationException("Url slug is already taken.");

        card.UrlSlug = slug;
        card.IsPublic = true;
        card.IsPaid = true;
        
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Card?> GetCardBySlugAsync(string slug)
    {
        return await _context.Cards
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.UrlSlug == slug && c.IsPublic);
    }

    public async Task<bool> UrlSlugExistsAsync(string slug, Guid? excludeCardId = null)
    {
        return await _context.Cards.AnyAsync(c =>
            c.UrlSlug == slug && (!excludeCardId.HasValue || c.Id != excludeCardId.Value));
    }

    public async Task<bool> UpdateCardAsync(Card card)
    {
        _context.Cards.Update(card);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Card>> GetCardsToAutoSendAsync()
    {
        var now = DateTime.UtcNow.AddHours(4); // Default to Georgia time for general queries
        var cards = await _context.Cards
            .AsNoTracking()
            .Where(c => c.IsAutoSend && !c.IsSent)
            .ToListAsync();

        return cards.Where(c => {
            if (string.IsNullOrEmpty(c.ScheduledDate) || string.IsNullOrEmpty(c.ScheduledTime)) 
                return false;
            
            if (DateTime.TryParse($"{c.ScheduledDate}T{c.ScheduledTime}", out var scheduledAt))
            {
                return scheduledAt <= now;
            }
            return false;
        }).ToList();
    }
}
