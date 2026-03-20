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
        return await _context.Templates.FindAsync(templateId);
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
            .FirstOrDefaultAsync(c => c.Id == cardId);
    }

    public async Task<IEnumerable<Card>> GetUserCardsAsync(string userId)
    {
        return await _context.Cards
            .Where(c => c.CreatorId == userId)
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
}
