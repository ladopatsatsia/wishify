using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Wishify.Application.Interfaces;
using Wishify.Domain.Entities;

namespace Wishify.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CardsController : ControllerBase
{
    private readonly ICardService _cardService;

    public CardsController(ICardService cardService)
    {
        _cardService = cardService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCard(Card card)
    {
        // If authenticated, set the creator ID
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId != null) card.CreatorId = userId;
        
        var created = await _cardService.CreateCardAsync(card);
        if (created == null) return BadRequest();
        return CreatedAtAction(nameof(GetCardById), new { id = created.Id }, created);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCardById(Guid id)
    {
        var card = await _cardService.GetCardByIdAsync(id);
        if (card == null) return NotFound();

        if (card.IsPublic) return Ok(card);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (card.CreatorId != userId) return Forbid();

        return Ok(card);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetCardBySlug(string slug)
    {
        var card = await _cardService.GetCardBySlugAsync(slug);
        if (card == null) return NotFound();
        return Ok(card);
    }

    [Authorize]
    [HttpPatch("{id}/toggle-public")]
    public async Task<IActionResult> TogglePublic(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var success = await _cardService.ToggleCardPublicAsync(id, userId);
        if (!success) return NotFound();

        return NoContent();
    }

    public class PublishRequest
    {
        public string UrlSlug { get; set; } = string.Empty;
    }

    [Authorize]
    [HttpPost("{id}/publish")]
    public async Task<IActionResult> Publish(Guid id, [FromBody] PublishRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (string.IsNullOrWhiteSpace(request.UrlSlug))
            return BadRequest("UrlSlug is required.");

        try
        {
            var success = await _cardService.PublishCardAsync(id, userId, request.UrlSlug);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("user")]
    public async Task<IActionResult> GetUserCards()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        var cards = await _cardService.GetUserCardsAsync(userId);
        return Ok(cards);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCard(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var success = await _cardService.DeleteCardAsync(id, userId);
        if (!success) return NotFound();

        return NoContent();
    }
}
