using API.Common;
using API.DTOs;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Endpoints;

public static class AccountEndpoint
{
    public static RouteGroupBuilder MapAccountEndpoint(this WebApplication app)
    {
        var group = app.MapGroup("/api/account").WithTags("account");

        group.MapPost("/register", async (HttpContext context,
        UserManager<AppUser> userManager,
        [FromForm] IFormFile? profileImage,
        [FromForm] string userName,
        [FromForm] string fullName,
        [FromForm] string email,
        [FromForm] string password) =>
        {
            var userFromDb = await userManager.FindByEmailAsync(email);
            if (userFromDb is not null)
            {
                return Results.BadRequest(Response<string>.Failure("User is already exist."));
            }

            if (profileImage is null)
            {
                return Results.BadRequest(Response<string>.Failure("Profile image is required."));
            }

            var picture = await FileUpload.Upload(profileImage);
            picture = $"{context.Request.Scheme}://{context.Request.Host}/uploads/{picture}";

            var user = new AppUser
            {
                Email = email,
                FullName = fullName,
                UserName = userName,
                ProfileImage = picture
            };

            var result = await userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                return Results.BadRequest(
                    Response<String>.Failure(result.Errors.Select(x => x.Description).FirstOrDefault()!));
            }

            return Results.Ok(Response<string>.Success("", "User created successfully."));
        }).DisableAntiforgery();

        group.MapPost("/login", async (UserManager<AppUser> userManager, TokenService tokenService, LoginDTO dto) =>
        {
            if (dto is null)
            {
                return Results.BadRequest(Response<string>.Failure("Invalid login details"));
            }

            var user = await userManager.FindByEmailAsync(dto.Email);

            if (user is null)
            {
                return Results.BadRequest(Response<string>.Failure("User not found"));
            }

            var result = await userManager.CheckPasswordAsync(user!, dto.Password);

            if (!result)
            {
                return Results.BadRequest(Response<string>.Failure("Invalid password"));
            }

            var token = tokenService.GenerateToken(user.Id, user.UserName!);

            return Results.Ok(Response<string>.Success(token, "Login successfully"));
        });
        
        return group;
    }
}
