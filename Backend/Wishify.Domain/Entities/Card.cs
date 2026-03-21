using System;
using System.Text.Json.Serialization;

namespace Wishify.Domain.Entities;

public class Card
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? TemplateId { get; set; }
    [JsonIgnore]
    public Template? Template { get; set; }
    
    public string? CreatorId { get; set; }
    [JsonIgnore]
    public ApplicationUser? Creator { get; set; }
    
    public string RecipientName { get; set; } = string.Empty;
    
    // Customized Content
    public string Heading { get; set; } = string.Empty;
    public string Message1 { get; set; } = string.Empty;
    public string Message2 { get; set; } = string.Empty;
    public string Footer { get; set; } = "Sent with Love from Wishify";
    public string? AudioUrl { get; set; }
    
    // Style overrides (optional)
    public string? CustomEmoji { get; set; }
    public string? CustomBgGradient { get; set; }
    
    // Additional features
    public string? GiftBoxUrl { get; set; }
    public string? ImagesJson { get; set; }
    
    public bool IsPublic { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
