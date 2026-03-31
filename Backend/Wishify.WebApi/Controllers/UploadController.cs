using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace Wishify.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public UploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
        // Ensure the upload directory exists
        var uploadPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads");
        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }
    }

    [HttpPost]
    public async Task<IActionResult> UploadFiles(List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
        {
            return BadRequest("No files uploaded.");
        }

        var uploadedUrls = new List<string>();
        var uploadPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads");

        foreach (var file in files)
        {
            if (file.Length > 0)
            {
                // Validate file type (optional but recommended)
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                if (!allowedExtensions.Contains(extension))
                {
                    continue; // Skip invalid files
                }

                // Create a unique filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Construct the public URL
                // We assume the frontend can reach the root of the API server
                var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
                var fileUrl = $"{baseUrl}/uploads/{fileName}";
                uploadedUrls.Add(fileUrl);
            }
        }

        return Ok(uploadedUrls);
    }
}
