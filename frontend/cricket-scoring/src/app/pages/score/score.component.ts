import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatchService, Match, TeamPlayer, UpdateMatchRequest, BattingStats, BowlingStats } from '../../services/match.service';
import { AddPlayerModalComponent, Player } from '../../components/add-player-modal/add-player-modal.component';
import { AddTeamCardModalComponent } from "../../components/teamCard";

@Component({
  selector: 'app-score',
  imports: [CommonModule, FormsModule, RouterLink, AddPlayerModalComponent, AddTeamCardModalComponent],
  template: `
    <div class="score-container">
      @if (match()) {
        <div class="match-header">
          <h1>{{ match()!.team1 }} vs {{ match()!.team2 }}</h1>
          <p class="venue">{{ match()!.venue }} | {{ match()!.matchDate | date:'medium' }}</p>
          <span class="match-type">{{ match()!.matchType }}</span>
        </div>

        <div class="score-board">
          <!-- Team Scores -->
          <div class="teams-score">
            <div class="team-card" [class.active]="currentInnings() === 1">
              <h2>{{ match()!.team1 }}</h2>
              <div class="score-display">
                <span class="runs">{{ team1Runs() }}</span>
                <span class="wickets">/{{ team1Wickets() }}</span>
                <span class="overs">({{ team1Overs() }}.{{ team1Balls() }})</span>
              </div>
              <div class="score-display">
                <button (click)="openTeamCardModal(match()!.team1)" class="btn">Show Players</button>
              </div>
              <div class="score-display">
                <button (click)="openPlayerModal(match()!.team1)" class="btn">Add Players</button>
              </div>
            </div>

            <div class="team-card" [class.active]="currentInnings() === 2">
              <h2>{{ match()!.team2 }}</h2>
              <div class="score-display">
                <span class="runs">{{ team2Runs() }}</span>
                <span class="wickets">/{{ team2Wickets() }}</span>
                <span class="overs">({{ team2Overs() }}.{{ team2Balls() }})</span>
              </div>
              <div class="score-display">
                <button (click)="openTeamCardModal(match()!.team2)" class="btn">Show Players</button>
              </div>
              <div class="score-display">
                <button (click)="openPlayerModal(match()!.team2)" class="btn">Add Players</button>
              </div>
            </div>
          </div>

          <!-- Current Innings Info -->
          <div class="current-innings">
            <h3>Current Innings: {{ currentInnings() === 1 ? match()!.team1 : match()!.team2 }}</h3>
            <div class="innings-info">
              <span>Over: {{ currentOvers() }}.{{ currentBalls() }}</span>
              <span>Run Rate: {{ currentRunRate() }}</span>
              @if (currentInnings() === 2) {
                <span>Required RR: {{ requiredRunRate() }}</span>
              }
            </div>
          </div>

          <!-- Current Players -->
          <div class="current-players">
            <div class="player-info">
              <div class="player-card">
                <label>Striker</label>
                @if (match()!.currentBatsmanStriker) {
                  <p>{{ match()!.currentBatsmanStriker }}</p>
                } @else {
                  <p class="empty">Select Striker</p>
                }
                <button (click)="openSelectPlayerModal('striker')" class="btn-select">Change</button>
              </div>
              
              <div class="player-card">
                <label>Non-Striker</label>
                @if (match()!.currentBatsmanNonStriker) {
                  <p>{{ match()!.currentBatsmanNonStriker }}</p>
                } @else {
                  <p class="empty">Select Non-Striker</p>
                }
                <button (click)="openSelectPlayerModal('non-striker')" class="btn-select">Change</button>
              </div>
              
              <div class="player-card">
                <label>Bowler</label>
                @if (match()!.currentBowler) {
                  <p>{{ match()!.currentBowler }}</p>
                } @else {
                  <p class="empty">Select Bowler</p>
                }
                <button (click)="openSelectPlayerModal('bowler')" class="btn-select">Change</button>
              </div>
            </div>
          </div>

          <!-- Player Statistics -->
          @if (match()!.currentBatsmanStriker || match()!.currentBatsmanNonStriker || match()!.currentBowler) {
            <div class="player-statistics">
              <h3>Player Statistics</h3>
              
              <!-- Batting Statistics -->
              @if (match()!.currentBatsmanStriker || match()!.currentBatsmanNonStriker) {
                <div class="batting-stats">
                  <h4>Batting</h4>
                  <div class="stats-table">
                    <div class="stats-header">
                      <span>Batsman</span>
                      <span>Runs</span>
                      <span>Balls</span>
                      <span>4s</span>
                      <span>6s</span>
                      <span>SR</span>
                    </div>
                    @if (match()!.currentBatsmanStriker) {
                      @let strikerStats = getBattingStats(match()!.currentBatsmanStriker!);
                      @if (strikerStats) {
                        <div class="stats-row striker">
                          <span>{{ match()!.currentBatsmanStriker }}*</span>
                          <span>{{ strikerStats.runs }}</span>
                          <span>{{ strikerStats.balls }}</span>
                          <span>{{ strikerStats.fours }}</span>
                          <span>{{ strikerStats.sixes }}</span>
                          <span>{{ strikerStats.strikeRate.toFixed(2) }}</span>
                        </div>
                      }
                    }
                    @if (match()!.currentBatsmanNonStriker) {
                      @let nonStrikerStats = getBattingStats(match()!.currentBatsmanNonStriker!);
                      @if (nonStrikerStats) {
                        <div class="stats-row">
                          <span>{{ match()!.currentBatsmanNonStriker }}</span>
                          <span>{{ nonStrikerStats.runs }}</span>
                          <span>{{ nonStrikerStats.balls }}</span>
                          <span>{{ nonStrikerStats.fours }}</span>
                          <span>{{ nonStrikerStats.sixes }}</span>
                          <span>{{ nonStrikerStats.strikeRate.toFixed(2) }}</span>
                        </div>
                      }
                    }
                  </div>
                </div>
              }

              <!-- Bowling Statistics -->
              @if (match()!.currentBowler) {
                <div class="bowling-stats">
                  <h4>Bowling</h4>
                  <div class="stats-table">
                    <div class="stats-header">
                      <span>Bowler</span>
                      <span>Overs</span>
                      <span>Runs</span>
                      <span>Wickets</span>
                      <span>Economy</span>
                    </div>
                    @let bowlerStats = getBowlingStats(match()!.currentBowler!);
                    @if (bowlerStats) {
                      <div class="stats-row">
                        <span>{{ match()!.currentBowler }}</span>
                        <span>{{ bowlerStats.overs }}.{{ bowlerStats.balls }}</span>
                        <span>{{ bowlerStats.runs }}</span>
                        <span>{{ bowlerStats.wickets }}</span>
                        <span>{{ bowlerStats.economy.toFixed(2) }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          }

          <!-- Scoring Controls -->
          <div class="controls">
            <h3>Score Controls</h3>
            
            <div class="run-buttons">
              <button (click)="addRuns(0)" class="btn-run">0</button>
              <button (click)="addRuns(1)" class="btn-run">1</button>
              <button (click)="addRuns(2)" class="btn-run">2</button>
              <button (click)="addRuns(3)" class="btn-run">3</button>
              <button (click)="addRuns(4)" class="btn-run btn-boundary">4</button>
              <button (click)="addRuns(6)" class="btn-run btn-boundary">6</button>
            </div>
            
            <div class="extras">
              <button (click)="openExtrasModal('Wide')" class="btn-extra">Wide</button>
              <button (click)="openExtrasModal('No Ball')" class="btn-extra">No Ball</button>
              <button (click)="openExtrasModal('Bye')" class="btn-extra">Bye</button>
              <button (click)="openExtrasModal('Leg Bye')" class="btn-extra">Leg Bye</button>
            </div>

            <div class="action-buttons">
              <button (click)="addWicket()" class="btn-wicket" [disabled]="currentWickets() >= 10">
                Wicket
              </button>
              <button (click)="undoLastBall()" class="btn-undo" [disabled]="ballHistory().length === 0">
                Undo Last Ball
              </button>
              @if (currentInnings() === 1) {
                <button (click)="switchInnings()" class="btn-innings">
                  End Innings
                </button>
              }
              @if (currentInnings() === 2) {
                <button (click)="endMatch()" class="btn-end">
                  End Match
                </button>
              }
            </div>
          </div>

          <!-- Recent Balls -->
          <div class="recent-balls">
            <h3>This Over</h3>
            <div class="balls-display">
              @for (ball of recentBalls(); track $index) {
                <span class="ball-item" 
                      [class.boundary]="typeof ball === 'number' && ball >= 4"
                      [class.wicket]="ball === 'W'"
                      [class.extra]="ball === 'Wd' || ball === 'NB'">
                  {{ ball }}
                </span>
              }
            </div>
          </div>
        </div>
      } @else if (loading()) {
        <div class="loading">Loading match details...</div>
      } @else if (errorMessage()) {
        <div class="error">
          <p>{{ errorMessage() }}</p>
          <button [routerLink]="['/matches']" class="btn">Back to Matches</button>
        </div>
      }
    </div>

    <!-- Extras Modal -->
    @if (showExtrasModal()) {
      <div class="modal-overlay" (click)="closeExtrasModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ selectedExtraType() }} - Select Runs</h2>
            <button class="close-btn" (click)="closeExtrasModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="extras-options">
              <button (click)="addExtra(selectedExtraType(), 0)" class="extra-run-btn">{{ selectedExtraType() }} (No runs)</button>
              <button (click)="addExtra(selectedExtraType(), 1)" class="extra-run-btn">{{ selectedExtraType() }} + 1 Run</button>
              <button (click)="addExtra(selectedExtraType(), 2)" class="extra-run-btn">{{ selectedExtraType() }} + 2 Runs</button>
              <button (click)="addExtra(selectedExtraType(), 3)" class="extra-run-btn">{{ selectedExtraType() }} + 3 Runs</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Select Player Modal -->
    @if (showSelectPlayerModal()) {
      <div class="modal-overlay" (click)="closeSelectPlayerModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Select {{ selectedPlayerType() === 'bowler' ? 'Bowler' : selectedPlayerType() === 'striker' ? 'Striker Batsman' : 'Non-Striker Batsman' }}</h2>
            <button class="close-btn" (click)="closeSelectPlayerModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="players-grid">
              @for (player of getSelectablePlayersForType(); track player.name) {
                <button (click)="selectPlayer(player.name)" class="player-btn">
                  <span class="player-name">{{ player.name }}</span>
                  @if (player.jerseyNumber) {
                    <span class="jersey">#{{ player.jerseyNumber }}</span>
                  }
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    }


    <!-- Add Player Modal -->
    <app-add-player-modal
      [open]="showPlayerModal()"
      [team]="selectedTeam()"
      (closeModal)="closePlayerModal()"
      (playersAdded)="onPlayersAdded($event)"
    />
    <!-- add team card -->
    <team-card
      [open]="showTeamCardModal()"
      [team]="team()"
      [matchId]="match()?.id || ''"
      [playersList]="selectedTeamPlayers()"
      (closeModal)="closeTeamCardModal()"
    />
  `,
  styles: [`
    .score-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .match-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .match-header h1 {
      font-size: 2rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .venue {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .match-type {
      display: inline-block;
      padding: 0.25rem 1rem;
      background: #1976d2;
      color: white;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    .score-board {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .teams-score {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .team-card {
      padding: 1.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .team-card.active {
      border-color: #1976d2;
      background: #e3f2fd;
    }

    .team-card h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .score-display {
      font-size: 2.5rem;
      font-weight: bold;
    }

    .runs {
      color: #1976d2;
    }

    .wickets {
      color: #f44336;
    }

    .overs {
      font-size: 1.25rem;
      color: #666;
      margin-left: 0.5rem;
    }

    .current-innings {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 2rem;
    }

    .current-innings h3 {
      margin-bottom: 0.5rem;
      color: #1976d2;
    }

    .innings-info {
      display: flex;
      gap: 2rem;
      font-size: 0.9rem;
      color: #666;
    }

    .current-players {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border-left: 4px solid #1976d2;
    }

    .player-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .player-card {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #ddd;
      text-align: center;
    }

    .player-card label {
      display: block;
      font-weight: 600;
      color: #666;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }

    .player-card p {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0.5rem 0;
    }

    .player-card p.empty {
      color: #999;
      font-style: italic;
    }

    .btn-select {
      width: 100%;
      padding: 0.5rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.85rem;
      cursor: pointer;
      margin-top: 0.5rem;
    }

    .btn-select:hover {
      background: #1565c0;
    }

    .player-statistics {
      background: #f5f7fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border-left: 4px solid #4caf50;
    }

    .player-statistics h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .batting-stats, .bowling-stats {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .batting-stats h4, .bowling-stats h4 {
      margin: 0 0 1rem 0;
      color: #1976d2;
      font-size: 1rem;
    }

    .stats-table {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stats-header, .stats-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
      gap: 0.5rem;
      padding: 0.75rem;
      align-items: center;
    }

    .bowling-stats .stats-header, .bowling-stats .stats-row {
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    }

    .stats-header {
      background: #f0f0f0;
      font-weight: 600;
      font-size: 0.875rem;
      color: #666;
      border-radius: 4px;
    }

    .stats-row {
      background: #fafafa;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .stats-row.striker {
      background: #e3f2fd;
      font-weight: 600;
    }

    .stats-header span, .stats-row span {
      text-align: center;
    }

    .stats-header span:first-child, .stats-row span:first-child {
      text-align: left;
    }

    .players-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 0.75rem;
    }

    .player-btn {
      padding: 1rem;
      background: white;
      border: 2px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .player-btn:hover {
      border-color: #1976d2;
      background: #e3f2fd;
    }

    .player-name {
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .jersey {
      font-size: 0.75rem;
      color: #666;
      background: #f0f0f0;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
    }

    .controls h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .run-buttons {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .btn-run {
      padding: 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      border: 2px solid #1976d2;
      background: white;
      color: #1976d2;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-run:hover {
      background: #1976d2;
      color: white;
      transform: scale(1.05);
    }

    .btn-boundary {
      border-color: #4caf50;
      color: #4caf50;
    }

    .btn-boundary:hover {
      background: #4caf50;
    }

    .extras {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .btn-extra {
      padding: 0.75rem;
      font-size: 0.875rem;
      border: 2px solid #ff9800;
      background: white;
      color: #ff9800;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-extra:hover {
      background: #ff9800;
      color: white;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    }

    .btn-wicket, .btn-innings, .btn-end, .btn-undo {
      padding: 1rem 2rem;
      font-size: 1.125rem;
      font-weight: bold;
      border: 2px solid;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-wicket {
      border-color: #f44336;
      background: white;
      color: #f44336;
    }

    .btn-wicket:hover:not(:disabled) {
      background: #f44336;
      color: white;
    }

    .btn-wicket:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-undo {
      border-color: #ff9800;
      background: white;
      color: #ff9800;
    }

    .btn-undo:hover:not(:disabled) {
      background: #ff9800;
      color: white;
    }

    .btn-undo:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-innings {
      border-color: #2196f3;
      background: white;
      color: #2196f3;
    }

    .btn-innings:hover {
      background: #2196f3;
      color: white;
    }

    .btn-end {
      border-color: #4caf50;
      background: white;
      color: #4caf50;
    }

    .btn-end:hover {
      background: #4caf50;
      color: white;
    }

    .btn-undo {
      border-color: #ff5722;
      background: white;
      color: #ff5722;
    }

    .btn-undo:hover:not(:disabled) {
      background: #ff5722;
      color: white;
    }

    .btn-undo:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .recent-balls {
      margin-top: 2rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .recent-balls h3 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .balls-display {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .ball-item {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 50%;
      font-weight: bold;
      color: #333;
    }

    .ball-item.boundary {
      background: #4caf50;
      color: white;
      border-color: #4caf50;
    }

    .ball-item.wicket {
      background: #f44336;
      color: white;
      border-color: #f44336;
    }

    .ball-item.extra {
      background: #ff9800;
      color: white;
      border-color: #ff9800;
    }

    .loading, .error {
      text-align: center;
      padding: 3rem;
      font-size: 1.25rem;
      color: #666;
    }

    .error p {
      color: #f44336;
      margin-bottom: 1rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn:hover {
      background: #1565c0;
    }

    /* Extras Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      background: #f5f5f5;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #666;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #333;
    }

    .modal-body {
      padding: 2rem;
    }

    .extras-options {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .extra-run-btn {
      padding: 1rem;
      background: white;
      color: #ff9800;
      border: 2px solid #ff9800;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .extra-run-btn:hover {
      background: #ff9800;
      color: white;
      transform: scale(1.05);
    }
  `]
})
export class ScoreComponent implements OnInit {
  private matchService = inject(MatchService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  match = signal<Match | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  // Team 1 scores
  team1Runs = signal(0);
  team1Wickets = signal(0);
  team1Overs = signal(0);
  team1Balls = signal(0);
  team1Extras = signal(0);

  // Team 2 scores
  team2Runs = signal(0);
  team2Wickets = signal(0);
  team2Overs = signal(0);
  team2Balls = signal(0);
  team2Extras = signal(0);

  team1Players = signal<TeamPlayer[]>([]);
  team2Players = signal<TeamPlayer[]>([]);

  currentInnings = signal(1);
  recentBalls = signal<(number | string)[]>([]);

  // Ball history for undo functionality
  ballHistory = signal<{
    type: 'runs' | 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'wicket';
    runs: number;
    wicket: boolean;
    ballIncremented: boolean;
  }[]>([]);

  // Modal state
  showPlayerModal = signal(false);
  selectedTeam = signal('');

  // Modal state for team card
  showTeamCardModal = signal(false);
  team = signal('');

  // Extras modal state
  showExtrasModal = signal(false);
  selectedExtraType = signal('');

  // Player selection modal state
  showSelectPlayerModal = signal(false);
  selectedPlayerType = signal<'striker' | 'non-striker' | 'bowler'>('striker');

  // Computed selected team players
  selectedTeamPlayers = computed(() => {
    const teamName = this.team();
    const match = this.match();
    if (!match || !teamName) return [];
    const players = teamName === match.team1 ? this.team1Players() : this.team2Players();
    return players.map(p => ({
      ...p,
      role: p.role as 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper'
    }));
  });

  ngOnInit(): void {
    const matchId = this.route.snapshot.paramMap.get('id');
    if (matchId) {
      this.loadMatch(matchId);
    } else {
      this.errorMessage.set('No match ID provided');
      this.loading.set(false);
    }
  }

  loadMatch(id: string): void {
    this.matchService.getMatch(id).subscribe({
      next: (match) => {
        this.match.set(match);
        this.currentInnings.set(match.currentInnings || 1);

        // Load existing scores
        if (match.team1Score) {
          this.team1Runs.set(match.team1Score.runs);
          this.team1Wickets.set(match.team1Score.wickets);
          const totalBalls = Math.floor(match.team1Score.overs * 6);
          this.team1Overs.set(Math.floor(totalBalls / 6));
          this.team1Balls.set(totalBalls % 6);
          this.team1Extras.set(match.team1Score.extras);
        }

        if (match.team2Score) {
          this.team2Runs.set(match.team2Score.runs);
          this.team2Wickets.set(match.team2Score.wickets);
          const totalBalls = Math.floor(match.team2Score.overs * 6);
          this.team2Overs.set(Math.floor(totalBalls / 6));
          this.team2Balls.set(totalBalls % 6);
          this.team2Extras.set(match.team2Score.extras);
        }

        if (match.team1Players) {
          this.team1Players.set(match.team1Players);
        }

        if (match.team2Players) {
          this.team2Players.set(match.team2Players);
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading match', err);
        this.errorMessage.set('Failed to load match details');
        this.loading.set(false);
      }
    });
  }

  // Validation method
  canScore(): boolean {
    const match = this.match();
    if (!match) return false;
    
    if (!match.currentBatsmanStriker) {
      alert('Please select a striker batsman before scoring!');
      return false;
    }
    if (!match.currentBatsmanNonStriker) {
      alert('Please select a non-striker batsman before scoring!');
      return false;
    }
    if (!match.currentBowler) {
      alert('Please select a bowler before scoring!');
      return false;
    }
    
    return true;
  }

  // Initialize batting stats for a player
  initBattingStats(playerName: string): void {
    const match = this.match();
    if (!match) return;
    
    if (!match.battingStats) {
      match.battingStats = {};
    }
    
    if (!match.battingStats[playerName]) {
      match.battingStats[playerName] = {
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        isOut: false
      };
    }
    
    this.match.set(match);
  }

  // Initialize bowling stats for a player
  initBowlingStats(playerName: string): void {
    const match = this.match();
    if (!match) return;
    
    if (!match.bowlingStats) {
      match.bowlingStats = {};
    }
    
    if (!match.bowlingStats[playerName]) {
      match.bowlingStats[playerName] = {
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        maidens: 0,
        economy: 0
      };
    }
    
    this.match.set(match);
  }

  // Update batting stats
  updateBattingStats(playerName: string, runs: number, ballFaced: boolean = true): void {
    const match = this.match();
    if (!match || !match.battingStats) return;
    
    const stats = match.battingStats[playerName];
    if (!stats) return;
    
    stats.runs += runs;
    if (ballFaced) {
      stats.balls += 1;
    }
    if (runs === 4) {
      stats.fours += 1;
    }
    if (runs === 6) {
      stats.sixes += 1;
    }
    stats.strikeRate = stats.balls > 0 ? (stats.runs / stats.balls) * 100 : 0;
    
    match.battingStats[playerName] = stats;
    this.match.set(match);
  }

  // Update bowling stats
  updateBowlingStats(bowlerName: string, runs: number, wicket: boolean = false, ballBowled: boolean = true): void {
    const match = this.match();
    if (!match || !match.bowlingStats) return;
    
    const stats = match.bowlingStats[bowlerName];
    if (!stats) return;
    
    stats.runs += runs;
    if (ballBowled) {
      stats.balls += 1;
      if (stats.balls % 6 === 0) {
        stats.overs += 1;
        stats.balls = 0;
      }
    }
    if (wicket) {
      stats.wickets += 1;
    }
    
    const totalBalls = (stats.overs * 6) + stats.balls;
    stats.economy = totalBalls > 0 ? (stats.runs / totalBalls) * 6 : 0;
    
    match.bowlingStats[bowlerName] = stats;
    this.match.set(match);
  }

  // Get batting stats for display
  getBattingStats(playerName: string): BattingStats | null {
    const match = this.match();
    return match?.battingStats?.[playerName] || null;
  }

  // Get bowling stats for display
  getBowlingStats(playerName: string): BowlingStats | null {
    const match = this.match();
    return match?.bowlingStats?.[playerName] || null;
  }

  currentOvers(): number {
    return this.currentInnings() === 1 ? this.team1Overs() : this.team2Overs();
  }

  currentBalls(): number {
    return this.currentInnings() === 1 ? this.team1Balls() : this.team2Balls();
  }

  currentRuns(): number {
    return this.currentInnings() === 1 ? this.team1Runs() : this.team2Runs();
  }

  currentWickets(): number {
    return this.currentInnings() === 1 ? this.team1Wickets() : this.team2Wickets();
  }

  swapBatsmen(): void {
    const match = this.match();
    if (!match) return;

    const striker = match.currentBatsmanStriker;
    match.currentBatsmanStriker = match.currentBatsmanNonStriker;
    match.currentBatsmanNonStriker = striker;

    this.match.set(match);
  }

  addRuns(runs: number): void {
    // Validate players are selected
    if (!this.canScore()) return;

    const match = this.match();
    if (!match) return;

    // Initialize stats if needed
    if (match.currentBatsmanStriker) {
      this.initBattingStats(match.currentBatsmanStriker);
    }
    if (match.currentBowler) {
      this.initBowlingStats(match.currentBowler);
    }

    // Add runs to team score
    if (this.currentInnings() === 1) {
      this.team1Runs.update(r => r + runs);
    } else {
      this.team2Runs.update(r => r + runs);
    }
    
    // Update batting stats for striker
    if (match.currentBatsmanStriker) {
      this.updateBattingStats(match.currentBatsmanStriker, runs, true);
    }

    // Update bowling stats for bowler
    if (match.currentBowler) {
      this.updateBowlingStats(match.currentBowler, runs, false, true);
    }
    
    // Swap batsmen on odd runs
    if (runs % 2 !== 0) {
      this.swapBatsmen();
    }

    this.recentBalls.update(balls => [...balls, runs]);
    this.ballHistory.update(h => [...h, { type: 'runs', runs, wicket: false, ballIncremented: true }]);
    this.incrementBall();
    this.updateMatch();
  }

  openExtrasModal(extraType: string): void {
    this.selectedExtraType.set(extraType);
    this.showExtrasModal.set(true);
  }

  closeExtrasModal(): void {
    this.showExtrasModal.set(false);
    this.selectedExtraType.set('');
  }

  addExtra(extraType: string, extraRuns: number): void {
    const baseRun = 1; // Wide, No Ball, Bye, Leg Bye - always 1 base run
    const totalRuns = baseRun + extraRuns;

    if (this.currentInnings() === 1) {
      this.team1Runs.update(r => r + totalRuns);
      this.team1Extras.update(e => e + totalRuns);
    } else {
      this.team2Runs.update(r => r + totalRuns);
      this.team2Extras.update(e => e + totalRuns);
    }

    // Add to recent balls
    let ballNotation = '';
    if (extraType === 'Wide') {
      ballNotation = extraRuns > 0 ? `Wd+${extraRuns}` : 'Wd';
    } else if (extraType === 'No Ball') {
      ballNotation = extraRuns > 0 ? `NB+${extraRuns}` : 'NB';
    } else if (extraType === 'Bye') {
      ballNotation = extraRuns > 0 ? `B+${extraRuns}` : 'B';
    } else if (extraType === 'Leg Bye') {
      ballNotation = extraRuns > 0 ? `LB+${extraRuns}` : 'LB';
    }

    this.recentBalls.update(balls => [...balls, ballNotation]);

    // Record in history
    const ballIncremented = extraType === 'Bye' || extraType === 'Leg Bye';
    this.ballHistory.update(h => [...h, { 
      type: extraType.toLowerCase().replace(' ', '-') as any, 
      runs: totalRuns, 
      wicket: false, 
      ballIncremented 
    }]);

    // Don't increment ball for wide/no ball (they are dead balls)
    if (ballIncremented) {
      this.incrementBall();
    }

    this.updateMatch();
    this.closeExtrasModal();
  }

  addWide(): void {
    const runs = 1;
    if (this.currentInnings() === 1) {
      this.team1Runs.update(r => r + runs);
      this.team1Extras.update(e => e + runs);
    } else {
      this.team2Runs.update(r => r + runs);
      this.team2Extras.update(e => e + runs);
    }
    
    this.recentBalls.update(balls => [...balls, 'Wd']);
    // Don't increment ball for wide
    this.updateMatch();
  }

  addNoBall(): void {
    const runs = 1;
    if (this.currentInnings() === 1) {
      this.team1Runs.update(r => r + runs);
      this.team1Extras.update(e => e + runs);
    } else {
      this.team2Runs.update(r => r + runs);
      this.team2Extras.update(e => e + runs);
    }
    
    this.recentBalls.update(balls => [...balls, 'NB']);
    // Don't increment ball for no ball
    this.updateMatch();
  }

  addBye(runs: number): void {
    if (this.currentInnings() === 1) {
      this.team1Runs.update(r => r + runs);
      this.team1Extras.update(e => e + runs);
    } else {
      this.team2Runs.update(r => r + runs);
      this.team2Extras.update(e => e + runs);
    }
    
    this.recentBalls.update(balls => [...balls, `${runs}b`]);
    this.incrementBall();
    this.updateMatch();
  }

  addLegBye(runs: number): void {
    if (this.currentInnings() === 1) {
      this.team1Runs.update(r => r + runs);
      this.team1Extras.update(e => e + runs);
    } else {
      this.team2Runs.update(r => r + runs);
      this.team2Extras.update(e => e + runs);
    }
    
    this.recentBalls.update(balls => [...balls, `${runs}lb`]);
    this.incrementBall();
    this.updateMatch();
  }

  addWicket(): void {
    // Validate players are selected
    if (!this.canScore()) return;

    const match = this.match();
    if (!match) return;

    if (this.currentWickets() < 10) {
      // Initialize stats if needed
      if (match.currentBatsmanStriker) {
        this.initBattingStats(match.currentBatsmanStriker);
      }
      if (match.currentBowler) {
        this.initBowlingStats(match.currentBowler);
      }

      if (this.currentInnings() === 1) {
        this.team1Wickets.update(w => w + 1);
      } else {
        this.team2Wickets.update(w => w + 1);
      }

      // Update batting stats - mark batsman as out
      if (match.currentBatsmanStriker && match.battingStats) {
        const stats = match.battingStats[match.currentBatsmanStriker];
        if (stats) {
          stats.isOut = true;
          stats.balls += 1; // Increment balls faced
          match.battingStats[match.currentBatsmanStriker] = stats;
          this.match.set(match);
        }
      }

      // Update bowling stats - increment wicket
      if (match.currentBowler) {
        this.updateBowlingStats(match.currentBowler, 0, true, true);
      }
      
      this.recentBalls.update(balls => [...balls, 'W']);
      this.ballHistory.update(h => [...h, { type: 'wicket', runs: 0, wicket: true, ballIncremented: true }]);
      this.incrementBall();
      this.updateMatch();

      // Auto end innings if all out
      if (this.currentWickets() === 10) {
        setTimeout(() => this.switchInnings(), 1000);
      }
    }
  }

  handleEndOfOver(): void {
    const match = this.match();
    if (!match) return;

    // Swap striker and non-striker
    const striker = match.currentBatsmanStriker;
    match.currentBatsmanStriker = match.currentBatsmanNonStriker;
    match.currentBatsmanNonStriker = striker;

    // Clear the current bowler to prompt for a new one
    match.currentBowler = undefined;

    this.match.set(match);
    this.updateMatch();

    // Alert user to select a new bowler
    alert('Over completed! Please select a new bowler.');
  }

  incrementBall(): void {
    const currentBalls = this.currentBalls();
    
    if (currentBalls === 5) {
      // Complete over
      if (this.currentInnings() === 1) {
        this.team1Overs.update(o => o + 1);
        this.team1Balls.set(0);
      } else {
        this.team2Overs.update(o => o + 1);
        this.team2Balls.set(0);
      }
      this.recentBalls.set([]);
      this.handleEndOfOver(); // Call the new end-of-over logic
    } else {
      if (this.currentInnings() === 1) {
        this.team1Balls.update(b => b + 1);
      } else {
        this.team2Balls.update(b => b + 1);
      }
    }
  }

  switchInnings(): void {
    if (confirm('End first innings and start second innings?')) {
      this.currentInnings.set(2);
      this.recentBalls.set([]);
      this.updateMatch();
    }
  }

  endMatch(): void {
    if (confirm('End this match?')) {
      const result = this.calculateResult();
      const updateData: UpdateMatchRequest = {
        status: 'Completed',
        result: result,
        team1Score: {
          runs: this.team1Runs(),
          wickets: this.team1Wickets(),
          overs: this.team1Overs() + (this.team1Balls() / 10),
          extras: this.team1Extras()
        },
        team2Score: {
          runs: this.team2Runs(),
          wickets: this.team2Wickets(),
          overs: this.team2Overs() + (this.team2Balls() / 10),
          extras: this.team2Extras()
        }
      };

      this.matchService.updateMatch(this.match()!.id, updateData).subscribe({
        next: () => {
          alert(`Match ended! ${result}`);
          this.router.navigate(['/matches']);
        },
        error: (err) => {
          console.error('Error ending match', err);
          alert('Failed to end match');
        }
      });
    }
  }

  calculateResult(): string {
    const team1Score = this.team1Runs();
    const team2Score = this.team2Runs();
    const team1Name = this.match()!.team1;
    const team2Name = this.match()!.team2;

    if (team1Score > team2Score) {
      return `${team1Name} won by ${team1Score - team2Score} runs`;
    } else if (team2Score > team1Score) {
      return `${team2Name} won by ${10 - this.team2Wickets()} wickets`;
    } else {
      return 'Match tied';
    }
  }

  updateMatch(): void {
    const match = this.match();
    if (!match) return;

    const updateData: UpdateMatchRequest = {
      status: 'Live',
      currentInnings: this.currentInnings(),
      team1Score: {
        runs: this.team1Runs(),
        wickets: this.team1Wickets(),
        overs: this.team1Overs() + (this.team1Balls() / 10),
        extras: this.team1Extras()
      },
      team2Score: {
        runs: this.team2Runs(),
        wickets: this.team2Wickets(),
        overs: this.team2Overs() + (this.team2Balls() / 10),
        extras: this.team2Extras()
      },
      team1Players: match.team1Players,
      team2Players: match.team2Players,
      currentBatsmanStriker: match.currentBatsmanStriker,
      currentBatsmanNonStriker: match.currentBatsmanNonStriker,
      currentBowler: match.currentBowler,
      battingStats: match.battingStats,
      bowlingStats: match.bowlingStats
    };

    this.matchService.updateMatch(match.id, updateData).subscribe({
      error: (err) => console.error('Error updating match', err)
    });
  }

  currentRunRate(): string {
    const totalBalls = this.currentOvers() * 6 + this.currentBalls();
    if (totalBalls === 0) return '0.00';
    const rate = (this.currentRuns() / totalBalls) * 6;
    return rate.toFixed(2);
  }

  requiredRunRate(): string {
    if (this.currentInnings() !== 2) return '0.00';
    
    const target = this.team1Runs() + 1;
    const runsNeeded = target - this.team2Runs();
    const totalBalls = this.currentOvers() * 6 + this.currentBalls();
    const remainingBalls = (20 * 6) - totalBalls; // Assuming T20
    
    if (remainingBalls <= 0) return '0.00';
    const rate = (runsNeeded / remainingBalls) * 6;
    return rate.toFixed(2);
  }

  openPlayerModal(teamName: string): void {
    this.selectedTeam.set(teamName);
    this.showPlayerModal.set(true);
  }

  closePlayerModal(): void {
    this.showPlayerModal.set(false);
    this.selectedTeam.set('');
  }

  onPlayersAdded(players: Player[]): void {
    const mapped: TeamPlayer[] = players.map(p => ({
      name: p.name,
      role: p.role,
      isWicketKeeper: p.isWicketKeeper ?? (p.role === 'Wicket-Keeper'),
      isCaptain: false,
      jerseyNumber: p.jerseyNumber || undefined
    }));

    if (this.selectedTeam() === this.match()!.team1) {
      this.team1Players.update(list => [...list, ...mapped]);
    } else {
      this.team2Players.update(list => [...list, ...mapped]);
    }

    this.updateMatch();
    alert(`${players.length} player(s) added successfully to ${this.selectedTeam()}!`);
  }

  openTeamCardModal(teamName: string): void {
    console.log('teamName :', teamName); 
    this.team.set(teamName);
    this.showTeamCardModal.set(true);
  }
  closeTeamCardModal(): void {
    this.showTeamCardModal.set(false);
    this.team.set('');
  }

  openSelectPlayerModal(type: 'striker' | 'non-striker' | 'bowler'): void {
    this.selectedPlayerType.set(type);
    this.showSelectPlayerModal.set(true);
  }

  closeSelectPlayerModal(): void {
    this.showSelectPlayerModal.set(false);
  }

  getSelectablePlayersForType(): TeamPlayer[] {
    const playerType = this.selectedPlayerType();
    const currentTeamPlayers = this.currentInnings() === 1 ? this.team1Players() : this.team2Players();

    if (playerType === 'bowler') {
      // Show opposite team's players (bowlers come from fielding team)
      return this.currentInnings() === 1 ? this.team2Players() : this.team1Players();
    } else {
      // Show current batting team's players
      return currentTeamPlayers;
    }
  }

    selectPlayer(playerName: string): void {
      const match = this.match();
      if (!match) return;
  
      const playerType = this.selectedPlayerType();
      
      if (playerType === 'striker') {
        // When a wicket falls, the old striker is out. The new player becomes the striker.
        if (match.battingStats && match.currentBatsmanStriker && match.battingStats[match.currentBatsmanStriker]?.isOut) {
            match.currentBatsmanStriker = playerName;
        } else {
            match.currentBatsmanStriker = playerName;
        }
      } else if (playerType === 'non-striker') {
        match.currentBatsmanNonStriker = playerName;
      } else if (playerType === 'bowler') {
        match.currentBowler = playerName;
      }
  
      this.match.set(match);
      this.updateMatch();
      this.closeSelectPlayerModal();
    }

  undoLastBall(): void {
    const history = this.ballHistory();
    if (history.length === 0) return;

    const lastBall = history[history.length - 1];
    const currentInnings = this.currentInnings();

    // Reverse runs
    if (currentInnings === 1) {
      this.team1Runs.update(r => r - lastBall.runs);
    } else {
      this.team2Runs.update(r => r - lastBall.runs);
    }

    // Reverse extras if it was an extra
    if (lastBall.type !== 'runs' && lastBall.type !== 'wicket') {
      if (currentInnings === 1) {
        this.team1Extras.update(e => e - lastBall.runs);
      } else {
        this.team2Extras.update(e => e - lastBall.runs);
      }
    }

    // Reverse wicket
    if (lastBall.wicket) {
      if (currentInnings === 1) {
        this.team1Wickets.update(w => w - 1);
      } else {
        this.team2Wickets.update(w => w - 1);
      }
    }

    // Reverse ball increment
    if (lastBall.ballIncremented) {
      const currentBalls = this.currentBalls();
      if (currentBalls === 0) {
        // Reverse to previous over
        if (currentInnings === 1) {
          this.team1Overs.update(o => o - 1);
          this.team1Balls.set(5);
        } else {
          this.team2Overs.update(o => o - 1);
          this.team2Balls.set(5);
        }
      } else {
        if (currentInnings === 1) {
          this.team1Balls.update(b => b - 1);
        } else {
          this.team2Balls.update(b => b - 1);
        }
      }
    }

    // Remove from recent balls
    this.recentBalls.update(balls => balls.slice(0, -1));

    // Remove from history
    this.ballHistory.update(h => h.slice(0, -1));

      // Update match in DB
      this.updateMatch();
    }
  }
