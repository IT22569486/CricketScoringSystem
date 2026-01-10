using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using CricketScoring.Api.Models;
using CricketScoring.Api.DTOs;

namespace CricketScoring.Api.Services
{
    public class AuthService
    {
        private readonly IFirestoreService _firestoreService;

        public AuthService(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<User> RegisterAsync(UserRegistrationDto registrationDto)
        {
            if (await _firestoreService.GetUserByEmailAsync(registrationDto.Email) != null)
            {
                return null; // User already exists
            }

            CreatePasswordHash(registrationDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var user = new User
            {
                Email = registrationDto.Email.ToLower(),
                Username = registrationDto.Username,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };

            return await _firestoreService.CreateUserAsync(user);
        }

        public async Task<User?> LoginAsync(string email, string password)
        {
            var user = await _firestoreService.GetUserByEmailAsync(email.ToLower());
            if (user?.PasswordHash == null || user.PasswordSalt == null || !VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null; // Invalid credentials
            }
            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }
    }
}