using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Wishify.Application.Interfaces;

namespace Wishify.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(HttpClient httpClient, IConfiguration configuration, ILogger<EmailService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
    {
        try
        {
            var apiKey = _configuration["EmailSettings:ResendApiKey"];
            var fromEmail = _configuration["EmailSettings:FromEmail"] ?? "Wishify <onboarding@resend.dev>";

            if (string.IsNullOrEmpty(apiKey))
            {
                _logger.LogWarning("[EmailService] Resend API Key is missing. Skipping email send to {ToEmail}.", toEmail);
                return false;
            }

            var payload = new
            {
                from = fromEmail,
                to = new[] { toEmail },
                subject = subject,
                html = isHtml ? body : null,
                text = !isHtml ? body : null
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
            request.Headers.Add("Authorization", $"Bearer {apiKey}");
            request.Content = JsonContent.Create(payload);

            _logger.LogInformation("[EmailService] Sending Email to {ToEmail} via Resend...", toEmail);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("[EmailService] Success! Resend Response: {Response}", content);
                return true;
            }

            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError("[EmailService] HTTP Error: {StatusCode}. Details: {Error}", response.StatusCode, errorContent);
            return false;
        }
        catch (System.Exception ex)
        {
            _logger.LogError(ex, "[EmailService] Critical failure sending email to {ToEmail}.", toEmail);
            return false;
        }
    }
}
