using CricketScoring.Api.Models;
using Google.Cloud.Firestore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CricketScoring.Api.Services
{
    public class FirestoreService : IFirestoreService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly CollectionReference _matchesCollection;
        private readonly CollectionReference _usersCollection;

        public FirestoreService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
            _matchesCollection = _firestoreDb.Collection("matches");
            _usersCollection = _firestoreDb.Collection("users");
        }

        public async Task<Match> CreateMatchAsync(Match match)
        {
            DocumentReference docRef = await _matchesCollection.AddAsync(match);
            match.Id = docRef.Id;
            await docRef.UpdateAsync("Id", docRef.Id);
            return match;
        }

        public async Task<Match?> GetMatchAsync(string id)
        {
            DocumentReference docRef = _matchesCollection.Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists)
            {
                Match match = snapshot.ConvertTo<Match>();
                match.Id = snapshot.Id;
                return match;
            }
            return null;
        }

        public async Task<IEnumerable<Match>> GetAllMatchesAsync()
        {
            QuerySnapshot snapshot = await _matchesCollection.GetSnapshotAsync();
            List<Match> matches = new List<Match>();
            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                Match match = document.ConvertTo<Match>();
                match.Id = document.Id;
                matches.Add(match);
            }
            return matches;
        }

        public async Task<Match?> UpdateMatchAsync(string id, Match match)
        {
            DocumentReference docRef = _matchesCollection.Document(id);
            
            // Create an update dictionary with only the fields that should be updated
            var updates = new Dictionary<string, object>
            {
                { "team1", match.Team1 },
                { "team2", match.Team2 },
                { "venue", match.Venue },
                { "matchType", match.MatchType },
                { "tossWinner", match.TossWinner },
                { "decision", match.Decision },
                { "team1Players", match.Team1Players },
                { "team2Players", match.Team2Players },
                { "currentInnings", match.CurrentInnings },
                { "team1Score", match.Team1Score },
                { "team2Score", match.Team2Score },
                { "currentBatsmanStriker", match.CurrentBatsmanStriker },
                { "currentBatsmanNonStriker", match.CurrentBatsmanNonStriker },
                { "currentBowler", match.CurrentBowler },
                { "battingStats", match.BattingStats },
                { "bowlingStats", match.BowlingStats },
                { "status", match.Status },
                { "result", match.Result },
                { "updatedAt", match.UpdatedAt }
            };
            
            await docRef.UpdateAsync(updates);
            return await GetMatchAsync(id);
        }

        public async Task DeleteMatchAsync(string id)
        {
            DocumentReference docRef = _matchesCollection.Document(id);
            await docRef.DeleteAsync();
        }

        public async Task<Player> AddPlayerToTeamAsync(string matchId, string teamName, Player player)
        {
            var match = await GetMatchAsync(matchId);
            if (match == null) throw new System.Exception("Match not found");

            if (match.Team1 == teamName)
            {
                match.Team1Players.Add(player);
            }
            else if (match.Team2 == teamName)
            {
                match.Team2Players.Add(player);
            }
            else
            {
                throw new System.Exception("Team not found in this match");
            }

            await UpdateMatchAsync(matchId, match);
            return player;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            DocumentReference docRef = _usersCollection.Document();
            user.Id = docRef.Id;
            await docRef.SetAsync(user);
            return user;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            Query query = _usersCollection.WhereEqualTo("email", email.ToLower());
            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            if (snapshot.Documents.Count == 0) return null;
            var user = snapshot.Documents[0].ConvertTo<User>();
            user.Id = snapshot.Documents[0].Id;
            return user;
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            DocumentReference docRef = _usersCollection.Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (!snapshot.Exists) return null;
            var user = snapshot.ConvertTo<User>();
            user.Id = snapshot.Id;
            return user;
        }
    }
}
