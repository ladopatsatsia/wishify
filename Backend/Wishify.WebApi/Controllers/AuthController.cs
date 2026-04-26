using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Wishify.Application.Interfaces;
using Wishify.Application.Models.Auth;

namespace Wishify.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var (response, error) = await _authService.RegisterAsync(request);
        if (response == null) return BadRequest(error ?? "Registration failed");
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        if (response == null) return Unauthorized("Invalid credentials");
        return Ok(response);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        var (success, error) = await _authService.ForgotPasswordAsync(request.Email);
        if (!success) return BadRequest(new { message = error });
        return Ok(new { message = "Reset link sent to your email." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        var (success, error) = await _authService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
        if (!success) return BadRequest(new { message = error });
        return Ok(new { message = "Password reset successfully." });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var (success, error) = await _authService.ChangePasswordAsync(userId, request);
        if (!success) return BadRequest(new { message = error });

        return Ok(new { message = "Password changed successfully." });
    }
}
