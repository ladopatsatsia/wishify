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
        return Ok(card);
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
}
