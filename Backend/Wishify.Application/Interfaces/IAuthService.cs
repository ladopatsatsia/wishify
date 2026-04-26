using Wishify.Application.Models.Auth;

namespace Wishify.Application.Interfaces;

public interface IAuthService
{
    Task<(AuthResponse? Response, string? Error)> RegisterAsync(RegisterRequest request);
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<(bool Success, string? Error)> ChangePasswordAsync(string userId, ChangePasswordRequest request);
    Task<(bool Success, string? Error)> ForgotPasswordAsync(string email);
    Task<(bool Success, string? Error)> ResetPasswordAsync(string email, string token, string newPassword);
}
