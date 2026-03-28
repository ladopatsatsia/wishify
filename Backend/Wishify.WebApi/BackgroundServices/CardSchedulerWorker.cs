using Wishify.Application.Interfaces;
using Wishify.Domain.Entities;

namespace Wishify.WebApi.BackgroundServices;

public class CardSchedulerWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<CardSchedulerWorker> _logger;

    public CardSchedulerWorker(IServiceScopeFactory scopeFactory, ILogger<CardSchedulerWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Card Scheduler Worker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessScheduledCards();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during scheduled cards processing.");
            }

            // Wait for 1 minute before next run
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    private async Task ProcessScheduledCards()
    {
        using var scope = _scopeFactory.CreateScope();
        var cardService = scope.ServiceProvider.GetRequiredService<ICardService>();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

        var cardsToSend = await cardService.GetCardsToAutoSendAsync();
        
        foreach (var card in cardsToSend)
        {
            _logger.LogInformation($"Sending scheduled card {card.Id} to {card.AutoSendRecipient}");

            var subject = $"✨ You received a magical card: {card.Heading}";
            var viewUrl = $"https://wishify.ge/view/birthday/{card.Id}"; // Assuming base URL
            
            var body = $@"
                <div style='font-family: sans-serif; padding: 20px; border: 1px solid #7c3aed; border-radius: 20px; max-width: 600px;'>
                    <h2 style='color: #7c3aed;'>Hello {card.RecipientName}!</h2>
                    <p>Someone special sent you a digital greeting card on Wishify.</p>
                    <div style='background: #fdf2f8; padding: 30px; border-radius: 15px; margin: 20px 0; text-align: center;'>
                        <h1 style='color: #db2777; margin: 0;'>{card.Heading}</h1>
                    </div>
                    <div style='text-align: center; margin-top: 30px;'>
                        <a href='{viewUrl}' 
                           style='background: linear-gradient(to right, #7c3aed, #db2777); color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 18px; box-shadow: 0 10px 15px rgba(124, 58, 237, 0.3);'>
                           Open Your Card ✨
                        </a>
                    </div>
                    <p style='color: #666; font-size: 14px; margin-top: 40px; border-top: 1px solid #eee; pt: 20px;'>
                        Sent via Wishify - Create your own magic today.
                    </p>
                </div>
            ";

            if (card.AutoSendRecipient != null)
            {
                var success = await emailService.SendEmailAsync(card.AutoSendRecipient, subject, body,true);
                if (success)
                {
                    card.IsSent = true;
                    await cardService.UpdateCardAsync(card);
                    _logger.LogInformation($"Successfully sent card {card.Id}");
                }
            }
        }
    }
}
