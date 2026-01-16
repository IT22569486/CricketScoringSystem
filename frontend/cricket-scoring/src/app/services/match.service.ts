import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

// Based on MatchResponse from the backend
export interface TeamPlayer {
jerseyNumber: any;
  name: string;
  role?: string;
  isCaptain: boolean;
  isWicketKeeper: boolean;
}

export interface BattingStats {
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
}

export interface BowlingStats {
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  maidens: number;
  economy: number;
}

export interface Match {
  id: string;
  matchNumber: string;
  team1: string;
  team2: string;
  venue: string;
  matchDate: Date;
  matchType: string;
  tossWinner?: string;
  tossDecision?: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  team1Score?: Score;
  team2Score?: Score;
  currentInnings?: number; 
  result?: string;
  team1Players?: TeamPlayer[];
  team2Players?: TeamPlayer[];
  currentBatsmanStriker?: string;
  currentBatsmanNonStriker?: string;
  currentBowler?: string;
  battingStats?: { [key: string]: BattingStats };
  bowlingStats?: { [key: string]: BowlingStats };
  createdAt: Date;
  updatedAt: Date;
}

export interface Score {
    runs: number;
    wickets: number;
    overs: number;
    extras: number;
}

// Based on CreateMatchRequest from backend
export interface CreateMatchRequest {
  team1: string;
  team2: string;
  venue: string;
  matchDate: Date;
  matchType: string;
  team1Players: TeamPlayer[];
  team2Players: TeamPlayer[];
}

// Based on UpdateMatchRequest
export type UpdateMatchRequest = Partial<Omit<Match, 'id' | 'createdAt' | 'updatedAt'>>;


@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/matches`; 

  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  getMatch(id: string): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }

  createMatch(match: CreateMatchRequest): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match);
  }

  updateMatch(id: string, match: UpdateMatchRequest): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${id}`, match);
  }

  deleteMatch(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}