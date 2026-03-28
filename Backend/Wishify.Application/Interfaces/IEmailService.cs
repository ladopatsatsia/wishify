namespace Wishify.Application.Interfaces;

public interface IEmailService
{
    Task<bool> SendEmailAsync(string to, string subject, string body,bool isHtml);
}
