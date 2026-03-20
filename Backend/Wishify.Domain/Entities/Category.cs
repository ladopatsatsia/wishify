namespace Wishify.Domain.Entities;

public class Category
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Emoji { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    
    public ICollection<Template> Templates { get; set; } = new List<Template>();
}
