using Microsoft.AspNetCore.Mvc;
using Wishify.Application.Interfaces;

namespace Wishify.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemplatesController : ControllerBase
{
    private readonly ITemplateService _templateService;

    public TemplatesController(ITemplateService templateService)
    {
        _templateService = templateService;
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _templateService.GetCategoriesAsync();
        return Ok(categories);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetTemplatesByCategory(string categoryId)
    {
        var templates = await _templateService.GetTemplatesByCategoryAsync(categoryId);
        return Ok(templates);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTemplateById(string id)
    {
        var template = await _templateService.GetTemplateByIdAsync(id);
        if (template == null) return NotFound();
        return Ok(template);
    }
}
