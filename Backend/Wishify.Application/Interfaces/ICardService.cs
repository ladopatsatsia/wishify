using System.Collections.Generic;
using System.Threading.Tasks;
using Wishify.Domain.Entities;

namespace Wishify.Application.Interfaces;

public interface ITemplateService
{
    Task<IEnumerable<Category>> GetCategoriesAsync();
    Task<IEnumerable<Template>> GetTemplatesByCategoryAsync(string categoryId);
    Task<Template?> GetTemplateByIdAsync(string templateId);
}

public interface ICardService
{
    Task<Card?> CreateCardAsync(Card card);
    Task<Card?> GetCardByIdAsync(Guid cardId);
    Task<IEnumerable<Card>> GetUserCardsAsync(string userId);
    Task<bool> DeleteCardAsync(Guid cardId, string userId);
}
