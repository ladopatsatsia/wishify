using Microsoft.AspNetCore.Identity;
using Wishify.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Wishify.Application.Interfaces;
using Wishify.Infrastructure.Services;
using Wishify.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// Clean Architecture - Add Infrastructure
builder.Services.AddInfrastructure(builder.Configuration);

// CORS for Frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(origin => 
              {
                  var uri = new Uri(origin);
                  return uri.Host == "localhost" || uri.Host.EndsWith(".localhost");
              })
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddHttpClient<IEmailService, ResendEmailService>();


var app = builder.Build();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<Wishify.Infrastructure.Persistence.ApplicationDbContext>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    
    context.Database.Migrate();
    await Wishify.Infrastructure.Persistence.DbSeeder.Seed(context, userManager, roleManager);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors();
app.UseResponseCompression();
app.UseStaticFiles(); // Default serves from wwwroot
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
