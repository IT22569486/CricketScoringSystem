using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;

namespace CricketScoring.Api.Models
{
    [FirestoreData]
    public class Player
    {
        [FirestoreProperty("name")]
        public string Name { get; set; } = "";

        [FirestoreProperty("role")]
        public string? Role { get; set; }

        [FirestoreProperty("isCaptain")]
        public bool IsCaptain { get; set; }

        [FirestoreProperty("isWicketKeeper")]
        public bool IsWicketKeeper { get; set; }
    }

    [FirestoreData]
    public class Match
    {
        [FirestoreDocumentId]
        public string Id { get; set; } = "";

        [FirestoreProperty("team1")]
        public string Team1 { get; set; } = "";

        [FirestoreProperty("team2")]
        public string Team2 { get; set; } = "";

        [FirestoreProperty("venue")]
        public string Venue { get; set; } = "";

        [FirestoreProperty("matchDate")]
        public Timestamp MatchDate { get; set; }

        [FirestoreProperty("matchType")]
        public string MatchType { get; set; } = "";

        [FirestoreProperty("tossWinner")]
        public string? TossWinner { get; set; }

        [FirestoreProperty("decision")]
        public string? Decision { get; set; } // Added missing property

        [FirestoreProperty("team1Players")]
        public List<Player> Team1Players { get; set; } = new List<Player>();

        [FirestoreProperty("team2Players")]
        public List<Player> Team2Players { get; set; } = new List<Player>();

        [FirestoreProperty("currentInnings")]
        public int CurrentInnings { get; set; }

        [FirestoreProperty("team1Score")]
        public ScoreDetails? Team1Score { get; set; }

        [FirestoreProperty("team2Score")]
        public ScoreDetails? Team2Score { get; set; }

        [FirestoreProperty("currentBatsmanStriker")]
        public string? CurrentBatsmanStriker { get; set; }

        [FirestoreProperty("currentBatsmanNonStriker")]
        public string? CurrentBatsmanNonStriker { get; set; }

        [FirestoreProperty("currentBowler")]
        public string? CurrentBowler { get; set; }

        [FirestoreProperty("battingStats")]
        public Dictionary<string, BattingStats>? BattingStats { get; set; }

        [FirestoreProperty("bowlingStats")]
        public Dictionary<string, BowlingStats>? BowlingStats { get; set; }

        [FirestoreProperty("status")]
        public string? Status { get; set; }

        [FirestoreProperty("result")]
        public string? Result { get; set; }

        [FirestoreProperty("createdAt")]
        public Timestamp CreatedAt { get; set; } = Timestamp.GetCurrentTimestamp();

        [FirestoreProperty("updatedAt")]
        public Timestamp UpdatedAt { get; set; } = Timestamp.GetCurrentTimestamp();
    }

    [FirestoreData]
    public class ScoreDetails
    {
        [FirestoreProperty("runs")]
        public int Runs { get; set; }

        [FirestoreProperty("wickets")]
        public int Wickets { get; set; }

        [FirestoreProperty("overs")]
        public double Overs { get; set; }

        [FirestoreProperty("extras")]
        public int Extras { get; set; }
    }

    [FirestoreData]
    public class BattingStats
    {
        [FirestoreProperty("runs")]
        public int Runs { get; set; }
        [FirestoreProperty("balls")]
        public int Balls { get; set; }
        [FirestoreProperty("fours")]
        public int Fours { get; set; }
        [FirestoreProperty("sixes")]
        public int Sixes { get; set; }
        [FirestoreProperty("strikeRate")]
        public double StrikeRate { get; set; }
        [FirestoreProperty("isOut")]
        public bool IsOut { get; set; }
    }

    [FirestoreData]
    public class BowlingStats
    {
        [FirestoreProperty("overs")]
        public int Overs { get; set; }
        [FirestoreProperty("balls")]
        public int Balls { get; set; }
        [FirestoreProperty("runs")]
        public int Runs { get; set; }
        [FirestoreProperty("wickets")]
        public int Wickets { get; set; }
        [FirestoreProperty("maidens")]
        public int Maidens { get; set; }
        [FirestoreProperty("economy")]
        public double Economy { get; set; }
    }
}

