using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Wishify.Application.Interfaces;

namespace Wishify.Infrastructure.Services;

public class SmsService : ISmsService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmsService> _logger;

    public SmsService(HttpClient httpClient, IConfiguration configuration, ILogger<SmsService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendSmsAsync(string phoneNumber, string message)
    {
        try
        {
            var username = _configuration["SmsSettings:Username"];
            var password = _configuration["SmsSettings:Password"];
            var clientId = _configuration["SmsSettings:ClientId"];
            var serviceId = _configuration["SmsSettings:ServiceId"];

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                _logger.LogWarning("[SmsService] SMS settings are missing. Skipping send to {PhoneNumber}.", phoneNumber);
                return false;
            }

            // Clean phone number: remove '+' prefix if present
            var cleanPhone = phoneNumber.Replace("+", "").Trim();

            // Construct URL for smsservice.ge (msg.ge)
            // Example: http://bi.msg.ge/sendsms.php?username=XXX&password=XXX&client_id=XXX&service_id=XXX&to=995XXXXXXXX&text=XXX&utf=1
            var url = $"http://bi.msg.ge/sendsms.php?" +
                      $"username={HttpUtility.UrlEncode(username)}" +
                      $"&password={HttpUtility.UrlEncode(password)}" +
                      $"&client_id={HttpUtility.UrlEncode(clientId)}" +
                      $"&service_id={HttpUtility.UrlEncode(serviceId)}" +
                      $"&to={HttpUtility.UrlEncode(cleanPhone)}" +
                      $"&text={HttpUtility.UrlEncode(message)}" +
                      $"&utf=1";

            _logger.LogInformation("[SmsService] Sending SMS to {PhoneNumber} via smsservice.ge...", cleanPhone);

            var response = await _httpClient.GetAsync(url);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("[SmsService] API Response: {Response}", content);
                // smsservice.ge typically returns codes like "ERR: 0" for success or specific error codes.
                return content.Contains("ERR: 0");
            }

            _logger.LogError("[SmsService] HTTP Error: {StatusCode}", response.StatusCode);
            return false;
        }
        catch (System.Exception ex)
        {
            _logger.LogError(ex, "[SmsService] Failed to send SMS to {PhoneNumber}.", phoneNumber);
            return false;
        }
    }
}
