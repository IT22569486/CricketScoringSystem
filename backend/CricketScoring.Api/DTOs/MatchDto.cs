using CricketScoring.Api.Models;
using System;
using System.Collections.Generic;

namespace CricketScoring.Api.DTOs
{
    public record MatchDto(
        string Id,
        string Team1,
        string Team2,
        string Venue,
        DateTime MatchDate,
        string MatchType,
        string? TossWinner,
        string? Decision,
        List<Player> Team1Players,
        List<Player> Team2Players,
        int CurrentInnings,
        ScoreDetails? Team1Score,
        ScoreDetails? Team2Score,
        string? CurrentBatsmanStriker,
        string? CurrentBatsmanNonStriker,
        string? CurrentBowler,
        Dictionary<string, BattingStatsDto>? BattingStats,
        Dictionary<string, BowlingStatsDto>? BowlingStats,
        string? Status = null,
        string? Result = null
    );

    public record CreateMatchRequest(
        string Team1,
        string Team2,
        string Venue,
        DateTime MatchDate,
        string MatchType,
        List<Player> Team1Players, // Use Player
        List<Player> Team2Players  // Use Player
    );

    public record UpdateMatchRequest(
        string? TossWinner = null,
        string? Decision = null,
        string? Status = null,
        int? CurrentInnings = null,
        ScoreDetails? Team1Score = null,
        ScoreDetails? Team2Score = null,
        List<Player>? Team1Players = null,
        List<Player>? Team2Players = null,
        string? CurrentBatsmanStriker = null,
        string? CurrentBatsmanNonStriker = null,
        string? CurrentBowler = null,
        Dictionary<string, BattingStats>? BattingStats = null,
        Dictionary<string, BowlingStats>? BowlingStats = null,
        string? Result = null
    );

    public record UpdateMatchScoreRequest(
        int Runs,
        int Wickets,
        double Overs,
        string CurrentBatsmanStriker,
        string CurrentBatsmanNonStriker,
        string CurrentBowler
    );

    public record UpdateTossRequest(
        string TossWinner,
        string Decision
    );

    public record AddPlayerRequest(
        string Name,
        string? Role = null,
        bool IsCaptain = false,
        bool IsWicketKeeper = false,
        string? TeamName = null
    );

    public record BattingStatsDto(
        int Runs,
        int Balls,
        int Fours,
        int Sixes,
        double StrikeRate,
        bool IsOut
    );

    public record BowlingStatsDto(
        int Overs,
        int Balls,
        int Runs,
        int Wickets,
        int Maidens,
        double Economy
    );

    public record MatchResponse(
        string Id,
        string MatchNumber,
        string Team1,
        string Team2,
        string Venue,
        DateTime MatchDate,
        string MatchType,
        string? TossWinner,
        string? TossDecision,
        string Status,
        ScoreResponse? Team1Score,
        ScoreResponse? Team2Score,
        int CurrentInnings,
        string? Result,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        List<Player>? Team1Players,
        List<Player>? Team2Players,
        string? CurrentBatsmanStriker,
        string? CurrentBatsmanNonStriker,
        string? CurrentBowler,
        Dictionary<string, BattingStatsDto>? BattingStats,
        Dictionary<string, BowlingStatsDto>? BowlingStats
    );

    public record PlayerAddingRequest(
        string Name,
        string Role,
        bool IsWicketKeeper,
        string TeamName,
        string BattingHand,
        string BowlingHand,
        int JerseyNumber
    );

    public record ScoreResponse(
        int Runs,
        int Wickets,
        double Overs,
        int Extras
    );
}
