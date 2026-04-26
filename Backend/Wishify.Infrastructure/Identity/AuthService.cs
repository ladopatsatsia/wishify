using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Wishify.Application.Interfaces;
using Wishify.Application.Models.Auth;
using Wishify.Domain.Entities;

namespace Wishify.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    public AuthService(UserManager<ApplicationUser> userManager, IConfiguration configuration, IEmailService emailService)
    {
        _userManager = userManager;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<(AuthResponse? Response, string? Error)> RegisterAsync(RegisterRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errorMsg = result.Errors.FirstOrDefault()?.Description ?? "Registration failed";
            return (null, errorMsg);
        }

        var authResponse = await GenerateAuthResponse(user);
        return (authResponse, null);
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            return null;

        return await GenerateAuthResponse(user);
    }

    public async Task<(bool Success, string? Error)> ChangePasswordAsync(string userId, ChangePasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return (false, "User not found.");

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
        {
            var error = result.Errors.FirstOrDefault()?.Description ?? "Password change failed.";
            return (false, error);
        }

        return (true, null);
    }

    public async Task<(bool Success, string? Error)> ForgotPasswordAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return (false, "User not found.");

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
        
        // Encode token for URL
        var encodedToken = System.Net.WebUtility.UrlEncode(token);
        var resetLink = $"{frontendUrl}/reset-password?token={encodedToken}&email={email}";

        var body = $@"
            <div style='font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                <h2 style='color: #7c3aed;'>Wishify Password Reset</h2>
                <p>You requested a password reset. Click the button below to set a new password:</p>
                <div style='margin: 30px 0;'>
                    <a href='{resetLink}' 
                       style='background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;'>
                       Reset Password
                    </a>
                </div>
                <p style='color: #666; font-size: 14px;'>If you didn't request this, you can ignore this email.</p>
                <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />
                <p style='color: #999; font-size: 12px;'>Wishify &copy; 2026</p>
            </div>
        ";

        await _emailService.SendEmailAsync(email, "Reset Your Wishify Password", body,true);
        return (true, null);
    }

    public async Task<(bool Success, string? Error)> ResetPasswordAsync(string email, string token, string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return (false, "User not found.");

        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
        if (!result.Succeeded)
        {
            var error = result.Errors.FirstOrDefault()?.Description ?? "Reset failed.";
            return (false, error);
        }

        return (true, null);
    }

    private async Task<AuthResponse> GenerateAuthResponse(ApplicationUser user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "SecretKeyThatMustBeAtLeast32CharactersLong");
        
        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "User";

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Role, role)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return new AuthResponse(tokenHandler.WriteToken(token), user.Email!, user.FirstName, user.LastName, role);
    }
}
