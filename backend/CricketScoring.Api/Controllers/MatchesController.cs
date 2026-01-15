using CricketScoring.Api.Models;
using CricketScoring.Api.Services;
using CricketScoring.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Google.Cloud.Firestore; // Add this for Timestamp
using System.Linq;
using System.Collections.Generic; // Add this using statement

namespace CricketScoring.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private readonly IFirestoreService _firestoreService;

        public MatchesController(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        // GET: api/matches
        [HttpGet]
        public async Task<IActionResult> GetAllMatches()
        {
            var matches = await _firestoreService.GetAllMatchesAsync();
            var matchDtos = matches.Select(m => ToMatchDto(m));
            return Ok(matchDtos);
        }

        // POST: api/matches
        [HttpPost]
        public async Task<IActionResult> CreateMatch([FromBody] CreateMatchRequest request)
        {
            var match = new Match
            {
                Team1 = request.Team1,
                Team2 = request.Team2,
                Venue = request.Venue,
                MatchDate = Timestamp.FromDateTime(request.MatchDate.ToUniversalTime()),
                MatchType = request.MatchType,
                Team1Players = request.Team1Players,
                Team2Players = request.Team2Players,
                CurrentInnings = 1
            };

            var createdMatch = await _firestoreService.CreateMatchAsync(match);
            return CreatedAtAction(nameof(GetMatch), new { id = createdMatch.Id }, ToMatchDto(createdMatch));
        }

        // PUT: api/matches/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMatch(string id, [FromBody] UpdateMatchRequest request)
        {
            var existingMatch = await _firestoreService.GetMatchAsync(id);
            if (existingMatch == null)
                return NotFound(new { message = "Match not found" });

            // Update toss details if provided
            if (!string.IsNullOrEmpty(request.TossWinner))
                existingMatch.TossWinner = request.TossWinner;
            
            if (!string.IsNullOrEmpty(request.Decision))
                existingMatch.Decision = request.Decision;

            // Update match status if provided
            if (!string.IsNullOrEmpty(request.Status))
                existingMatch.Status = request.Status;

            // Update result if match is completed
            if (!string.IsNullOrEmpty(request.Result))
                existingMatch.Result = request.Result;

            // Update current innings if provided
            if (request.CurrentInnings.HasValue)
                existingMatch.CurrentInnings = request.CurrentInnings.Value;

            // Update scores if provided
            if (request.Team1Score != null)
                existingMatch.Team1Score = request.Team1Score;
            
            if (request.Team2Score != null)
                existingMatch.Team2Score = request.Team2Score;

            // Update team players if provided
            if (request.Team1Players != null && request.Team1Players.Count > 0)
                existingMatch.Team1Players = request.Team1Players;
            
            if (request.Team2Players != null && request.Team2Players.Count > 0)
                existingMatch.Team2Players = request.Team2Players;

            // Update current players if provided
            if (!string.IsNullOrEmpty(request.CurrentBatsmanStriker))
                existingMatch.CurrentBatsmanStriker = request.CurrentBatsmanStriker;
            
            if (!string.IsNullOrEmpty(request.CurrentBatsmanNonStriker))
                existingMatch.CurrentBatsmanNonStriker = request.CurrentBatsmanNonStriker;
            
            if (!string.IsNullOrEmpty(request.CurrentBowler))
                existingMatch.CurrentBowler = request.CurrentBowler;

            // Update stats if provided
            if (request.BattingStats != null && request.BattingStats.Count > 0)
                existingMatch.BattingStats = request.BattingStats;
            
            if (request.BowlingStats != null && request.BowlingStats.Count > 0)
                existingMatch.BowlingStats = request.BowlingStats;

            // Update timestamp
            existingMatch.UpdatedAt = Timestamp.GetCurrentTimestamp();

            var updatedMatch = await _firestoreService.UpdateMatchAsync(id, existingMatch);
            return Ok(ToMatchDto(updatedMatch!));
        }

        // GET: api/matches/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMatch(string id)
        {
            var match = await _firestoreService.GetMatchAsync(id);
            if (match == null) return NotFound();
            return Ok(ToMatchDto(match));
        }

        // DELETE: api/matches/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatch(string id)
        {
            var existingMatch = await _firestoreService.GetMatchAsync(id);
            if (existingMatch == null)
                return NotFound(new { message = "Match not found" });

            await _firestoreService.DeleteMatchAsync(id);
            return NoContent();
        }

        // PUT: api/matches/{id}/toss - Update toss details
        [HttpPut("{id}/toss")]
        public async Task<IActionResult> UpdateToss(string id, [FromBody] UpdateTossRequest request)
        {
            var match = await _firestoreService.GetMatchAsync(id);
            if (match == null)
                return NotFound(new { message = "Match not found" });

            match.TossWinner = request.TossWinner;
            match.Decision = request.Decision;
            match.UpdatedAt = Timestamp.GetCurrentTimestamp();

            var updatedMatch = await _firestoreService.UpdateMatchAsync(id, match);
            return Ok(ToMatchDto(updatedMatch!));
        }

        // PUT: api/matches/{id}/score - Update match score
        [HttpPut("{id}/score")]
        public async Task<IActionResult> UpdateScore(string id, [FromBody] UpdateMatchScoreRequest request)
        {
            var match = await _firestoreService.GetMatchAsync(id);
            if (match == null)
                return NotFound(new { message = "Match not found" });

            // Determine which team's score to update based on current innings
            if (match.CurrentInnings == 1)
            {
                if (match.Team1Score == null)
                    match.Team1Score = new ScoreDetails();
                match.Team1Score.Runs = request.Runs;
                match.Team1Score.Wickets = request.Wickets;
                match.Team1Score.Overs = request.Overs;
            }
            else
            {
                if (match.Team2Score == null)
                    match.Team2Score = new ScoreDetails();
                match.Team2Score.Runs = request.Runs;
                match.Team2Score.Wickets = request.Wickets;
                match.Team2Score.Overs = request.Overs;
            }

            match.CurrentBatsmanStriker = request.CurrentBatsmanStriker;
            match.CurrentBatsmanNonStriker = request.CurrentBatsmanNonStriker;
            match.CurrentBowler = request.CurrentBowler;
            match.UpdatedAt = Timestamp.GetCurrentTimestamp();

            var updatedMatch = await _firestoreService.UpdateMatchAsync(id, match);
            return Ok(ToMatchDto(updatedMatch!));
        }

        // POST: api/matches/{id}/players - Add a player to a team
        [HttpPost("{id}/players")]
        public async Task<IActionResult> AddPlayerToTeam(string id, [FromBody] AddPlayerRequest request)
        {
            var match = await _firestoreService.GetMatchAsync(id);
            if (match == null)
                return NotFound(new { message = "Match not found" });

            if (string.IsNullOrEmpty(request.TeamName))
                return BadRequest(new { message = "TeamName is required" });

            var player = new Player
            {
                Name = request.Name,
                Role = request.Role,
                IsCaptain = request.IsCaptain,
                IsWicketKeeper = request.IsWicketKeeper
            };

            if (match.Team1 == request.TeamName)
            {
                match.Team1Players.Add(player);
            }
            else if (match.Team2 == request.TeamName)
            {
                match.Team2Players.Add(player);
            }
            else
            {
                return BadRequest(new { message = "Team not found in this match" });
            }

            match.UpdatedAt = Timestamp.GetCurrentTimestamp();
            var updatedMatch = await _firestoreService.UpdateMatchAsync(id, match);
            return Ok(new { message = "Player added successfully", match = ToMatchDto(updatedMatch!) });
        }

        private MatchDto ToMatchDto(Match match)
        {
            return new MatchDto(
                match.Id,
                match.Team1,
                match.Team2,
                match.Venue,
                match.MatchDate.ToDateTime(),
                match.MatchType,
                match.TossWinner,
                match.Decision,
                match.Team1Players,
                match.Team2Players,
                match.CurrentInnings,
                match.Team1Score,
                match.Team2Score,
                match.CurrentBatsmanStriker,
                match.CurrentBatsmanNonStriker,
                match.CurrentBowler,
                match.BattingStats?.ToDictionary(
                    kvp => kvp.Key,
                    kvp => new BattingStatsDto(kvp.Value.Runs, kvp.Value.Balls, kvp.Value.Fours, kvp.Value.Sixes, kvp.Value.StrikeRate, kvp.Value.IsOut)
                ),
                match.BowlingStats?.ToDictionary(
                    kvp => kvp.Key,
                    kvp => new BowlingStatsDto(kvp.Value.Overs, kvp.Value.Balls, kvp.Value.Runs, kvp.Value.Wickets, kvp.Value.Maidens, kvp.Value.Economy)
                ),
                match.Status,
                match.Result
            );
        }
    }
}
