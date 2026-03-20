namespace Wishify.Domain.Entities;

public class Template
{
    public string Id { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public Category Category { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string DefaultEmoji { get; set; } = "✨";
    public string BgGradient { get; set; } = string.Empty;
    public string ThemeColor { get; set; } = string.Empty;
    public string FontFamily { get; set; } = "font-sans";
    
    // Default content
    public string DefaultHeading { get; set; } = string.Empty;
    public string DefaultMessage1 { get; set; } = string.Empty;
    public string DefaultMessage2 { get; set; } = string.Empty;
    public string? DefaultAudioUrl { get; set; }
    public string? MusicLabel { get; set; }

    public ICollection<Card> SavedCards { get; set; } = new List<Card>();
}
