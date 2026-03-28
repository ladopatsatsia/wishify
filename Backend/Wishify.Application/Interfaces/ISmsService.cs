using System.Threading.Tasks;

namespace Wishify.Application.Interfaces;

public interface ISmsService
{
    Task<bool> SendSmsAsync(string phoneNumber, string message);
}
