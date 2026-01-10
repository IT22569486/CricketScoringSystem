namespace CricketScoring.Api.DTOs
{
    public record UserRegistrationDto(string Username, string Email, string Password);
    public record UserLoginDto(string Email, string Password);
    public record UserProfileDto(string Id, string Username, string Email);
    public record LoginResponseDto(string Token, UserProfileDto User);
}