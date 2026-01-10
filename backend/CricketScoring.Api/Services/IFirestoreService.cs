using CricketScoring.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CricketScoring.Api.Services
{
    public interface IFirestoreService
    {
        Task<Match> CreateMatchAsync(Match match);
        Task<Match?> GetMatchAsync(string id);
        Task<IEnumerable<Match>> GetAllMatchesAsync();
        Task<Match?> UpdateMatchAsync(string id, Match match);
        Task DeleteMatchAsync(string id);
        Task<Player> AddPlayerToTeamAsync(string matchId, string teamName, Player player);
        Task<User> CreateUserAsync(User user);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByIdAsync(string id);
    }
}
