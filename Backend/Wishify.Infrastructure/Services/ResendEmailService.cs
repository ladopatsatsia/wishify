using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Wishify.Application.Interfaces;

namespace Wishify.Infrastructure.Services;

public class ResendEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public ResendEmailService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string body, bool isHtml)
    {
        var apiKey = _configuration["EmailSettings:ResendApiKey"];
        var from = _configuration["EmailSettings:FromEmail"] ?? "Wishify <onboarding@resend.dev>";

        var request = new ResendRequest
        {
            From = from,
            To = new List<string> { to },
            Subject = subject,
            Html = body
        };

        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
        
        var response = await _httpClient.PostAsJsonAsync("https://api.resend.com/emails", request);
        
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Resend Error: {error}");
            return false;
        }

        return true;
    }

    private class ResendRequest
    {
        [JsonPropertyName("from")]
        public string From { get; set; } = string.Empty;

        [JsonPropertyName("to")]
        public List<string> To { get; set; } = new();

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("html")]
        public string Html { get; set; } = string.Empty;
    }
}
