using System.Collections.Generic;
using System.Threading.Tasks;
using Wishify.Domain.Entities;

namespace Wishify.Application.Interfaces;

public interface ITemplateService
{
    Task<IEnumerable<Category>> GetCategoriesAsync();
    Task<IEnumerable<Template>> GetTemplatesByCategoryAsync(string categoryId);
    Task<Template?> GetTemplateByIdAsync(string templateId);
    Task<IEnumerable<Template>> GetAllTemplatesAsync();
}

public interface ICardService
{
    Task<Card?> CreateCardAsync(Card card);
    Task<Card?> GetCardByIdAsync(Guid cardId);
    Task<IEnumerable<Card>> GetUserCardsAsync(string userId);
    Task<bool> DeleteCardAsync(Guid cardId, string userId);
    Task<bool> ToggleCardPublicAsync(Guid cardId, string userId);
    Task<bool> PublishCardAsync(Guid cardId, string userId, string slug);
    Task<Card?> GetCardBySlugAsync(string slug);
}
