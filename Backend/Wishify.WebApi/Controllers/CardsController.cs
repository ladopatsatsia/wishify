using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wishify.Application.Interfaces;
using Wishify.Domain.Entities;

namespace Wishify.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public partial class CardsController : ControllerBase
{
    private readonly ICardService _cardService;

    public CardsController(ICardService cardService)
    {
        _cardService = cardService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCard(Card card)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId != null)
        {
            card.CreatorId = userId;
        }

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

    public class ScheduleRequest
    {
        public bool IsAutoSend { get; set; }
        public string? Recipient { get; set; }
        public string? AutoSendRecipient { get; set; }
        public string? ScheduledDate { get; set; }
        public string? ScheduledTime { get; set; }
        public string? SendMethod { get; set; }
    }

    public class PublishRequest
    {
        public string UrlSlug { get; set; } = string.Empty;
        public ScheduleRequest? Schedule { get; set; }
        public bool IsAutoSend { get; set; }
        public string? AutoSendRecipient { get; set; }
        public string? ScheduledDate { get; set; }
        public string? ScheduledTime { get; set; }
        public string? SendMethod { get; set; }
    }

    [Authorize]
    [HttpPost("{id}/publish")]
    public async Task<IActionResult> Publish(Guid id, [FromBody] PublishRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var slug = request.UrlSlug?.Trim();
        if (string.IsNullOrWhiteSpace(slug))
        {
            return BadRequest(new { message = "UrlSlug is required." });
        }

        if (!SlugRegex().IsMatch(slug))
        {
            return BadRequest(new { message = "Url slug may only contain letters, numbers, hyphens, and underscores." });
        }

        if (await _cardService.UrlSlugExistsAsync(slug, id))
        {
            return BadRequest(new { message = "Url slug is already taken." });
        }

        var card = await _cardService.GetCardByIdAsync(id);
        if (card == null || card.CreatorId != userId) return NotFound();

        var schedule = GetSchedule(request);
        var validationError = ValidateSchedule(schedule);
        if (validationError != null)
        {
            return BadRequest(new { message = validationError });
        }

        card.UrlSlug = slug;
        card.IsPublic = true;
        card.IsPaid = true;
        card.IsSent = false;
        ApplySchedule(card, schedule);

        var success = await _cardService.UpdateCardAsync(card);
        if (!success) return BadRequest(new { message = "Could not update card during publish." });

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

    [Authorize]
    [HttpPatch("{id}/schedule")]
    public async Task<IActionResult> UpdateSchedule(Guid id, [FromBody] PublishRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var card = await _cardService.GetCardByIdAsync(id);
        if (card == null || card.CreatorId != userId) return NotFound();

        if (card.IsSent)
        {
          return BadRequest(new { message = "Cannot update schedule for a card that is already sent." });
        }

        var schedule = GetSchedule(request);
        var validationError = ValidateSchedule(schedule);
        if (validationError != null)
        {
            return BadRequest(new { message = validationError });
        }

        ApplySchedule(card, schedule);

        var success = await _cardService.UpdateCardAsync(card);
        if (!success) return BadRequest(new { message = "Could not update schedule." });

        return Ok(card);
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

    private static ScheduleRequest GetSchedule(PublishRequest request)
    {
        return request.Schedule ?? new ScheduleRequest
        {
            IsAutoSend = request.IsAutoSend,
            AutoSendRecipient = request.AutoSendRecipient,
            ScheduledDate = request.ScheduledDate,
            ScheduledTime = request.ScheduledTime,
            SendMethod = request.SendMethod
        };
    }

    private static void ApplySchedule(Card card, ScheduleRequest schedule)
    {
        card.IsAutoSend = schedule.IsAutoSend;

        if (!schedule.IsAutoSend)
        {
            card.AutoSendRecipient = null;
            card.SendMethod = null;
            card.ScheduledDate = null;
            card.ScheduledTime = null;
            return;
        }

        card.AutoSendRecipient = schedule.Recipient?.Trim() ?? schedule.AutoSendRecipient?.Trim();
        card.SendMethod = schedule.SendMethod;
        card.ScheduledDate = schedule.ScheduledDate;
        card.ScheduledTime = schedule.ScheduledTime;
    }

    private static string? ValidateSchedule(ScheduleRequest schedule)
    {
        if (!schedule.IsAutoSend)
        {
            return null;
        }

        var recipient = schedule.Recipient?.Trim() ?? schedule.AutoSendRecipient?.Trim();
        if (string.IsNullOrWhiteSpace(recipient))
        {
            return "Recipient contact is required for automatic send.";
        }

        var sendMethod = schedule.SendMethod?.Trim().ToLowerInvariant();
        if (sendMethod is not ("email" or "phone"))
        {
            return "Send method must be email or phone.";
        }

        if (sendMethod == "email" && !EmailRegex().IsMatch(recipient))
        {
            return "Please enter a valid email address.";
        }

        if (sendMethod == "phone" && !PhoneRegex().IsMatch(recipient))
        {
            return "Please enter a valid phone number (+995XXXXXXXXX).";
        }

        if (string.IsNullOrWhiteSpace(schedule.ScheduledDate) || string.IsNullOrWhiteSpace(schedule.ScheduledTime))
        {
            return "Scheduled date and time are required for automatic send.";
        }

        if (!DateTime.TryParse($"{schedule.ScheduledDate}T{schedule.ScheduledTime}", out var scheduledAt))
        {
            return "Scheduled date or time is invalid.";
        }

        if (scheduledAt <= DateTime.Now)
        {
            return "Scheduled send time must be in the future.";
        }

        return null;
    }

    [GeneratedRegex("^[a-zA-Z0-9_-]+$")]
    private static partial Regex SlugRegex();

    [GeneratedRegex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")]
    private static partial Regex EmailRegex();

    [GeneratedRegex("^\\+995\\d{9}$")]
    private static partial Regex PhoneRegex();
}
