using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Globalization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Wishify.Application.Interfaces;
using Wishify.Infrastructure.Persistence;

namespace Wishify.Infrastructure.Background;

public class CardSendWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<CardSendWorker> _logger;

    public CardSendWorker(IServiceProvider serviceProvider, ILogger<CardSendWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("[CardSendWorker] Started and polling for scheduled cards...");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var smsService = scope.ServiceProvider.GetRequiredService<ISmsService>();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                    // Filter cards: IsAutoSend == true, IsSent == false
                    var pendingCards = await context.Cards
                        .Include(c => c.Template)
                            .ThenInclude(t => t.Category)
                        .Where(c => c.IsAutoSend && !c.IsSent)
                        .ToListAsync(stoppingToken);

                    foreach (var card in pendingCards)
                    {
                        if (IsTimeToSend(card))
                        {
                            if (card.SendMethod == "phone")
                            {
                                await SendCardSms(card, smsService, context, stoppingToken);
                            }
                            else if (card.SendMethod == "email")
                            {
                                await SendCardEmail(card, emailService, context, stoppingToken);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[CardSendWorker] An error occurred while processing scheduled cards.");
            }

            // Poll every 60 seconds
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    private bool IsTimeToSend(Wishify.Domain.Entities.Card card)
    {
        if (string.IsNullOrEmpty(card.ScheduledDate) || string.IsNullOrEmpty(card.ScheduledTime))
            return false;

        try
        {
            var combinedStr = $"{card.ScheduledDate} {card.ScheduledTime}";
            if (DateTime.TryParseExact(combinedStr, "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var scheduledAt))
            {
                // Compare with current local time
                return scheduledAt <= DateTime.Now;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[CardSendWorker] Failed to parse schedule for Card {CardId}.", card.Id);
        }

        return false;
    }

    private async Task SendCardSms(Wishify.Domain.Entities.Card card, ISmsService smsService, ApplicationDbContext context, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(card.AutoSendRecipient) || string.IsNullOrEmpty(card.UrlSlug))
        {
            _logger.LogWarning("[CardSendWorker] Card {CardId} is missing recipient or slug. Marking as sent.", card.Id);
            card.IsSent = true;
            await context.SaveChangesAsync(ct);
            return;
        }

        var cardType = card.Template?.Category?.Label ?? "Greeting Card";
        var link = $"https://{card.UrlSlug}.wishyfy.ge";
        var message = $"👋 {card.RecipientName}, you received a {cardType} from Wishyfy! 🎁 View it here: {link}";

        _logger.LogInformation("[CardSendWorker] Attempting to send SMS for Card {CardId} to {Recipient}...", card.Id, card.AutoSendRecipient);

        var success = await smsService.SendSmsAsync(card.AutoSendRecipient, message);

        if (success)
        {
            _logger.LogInformation("[CardSendWorker] Success! Card {Id} SMS sent.", card.Id);
            card.IsSent = true;
            await context.SaveChangesAsync(ct);
        }
    }

    private async Task SendCardEmail(Wishify.Domain.Entities.Card card, IEmailService emailService, ApplicationDbContext context, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(card.AutoSendRecipient) || string.IsNullOrEmpty(card.UrlSlug))
        {
            _logger.LogWarning("[CardSendWorker] Card {CardId} is missing email recipient or slug. Marking as sent.", card.Id);
            card.IsSent = true;
            await context.SaveChangesAsync(ct);
            return;
        }

        var cardType = card.Template?.Category?.Label ?? "Greeting Card";
        var link = $"https://{card.UrlSlug}.wishyfy.ge";
        var subject = $"🎁 Special {cardType} for {card.RecipientName}!";
        var body = $@"
            <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                <h2 style='color: #6d28d9;'>Hello {card.RecipientName}! 👋</h2>
                <p style='font-size: 16px; color: #374151;'>Someone special has sent you a digital <strong>{cardType}</strong> through <strong>Wishify</strong>.</p>
                <div style='margin: 30px 0;'>
                    <a href='{link}' style='background: linear-gradient(to right, #7c3aed, #db2777); color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;'>
                        ✨ View Your {cardType}
                    </a>
                </div>
                <p style='font-size: 14px; color: #6b7280;'>Enjoy your wonderful surprise!</p>
                <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
                <p style='font-size: 12px; color: #9ca3af;'>Sent with love from Wishify.</p>
            </div>";

        _logger.LogInformation("[CardSendWorker] Attempting to send Email for Card {CardId} to {Recipient}...", card.Id, card.AutoSendRecipient);

        var success = await emailService.SendEmailAsync(card.AutoSendRecipient, subject, body, true);

        if (success)
        {
            _logger.LogInformation("[CardSendWorker] Success! Card {CardId} Email sent.", card.Id);
            card.IsSent = true;
            await context.SaveChangesAsync(ct);
        }
    }
}
