import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Match, MatchService } from '../services/match.service';

export interface Player {
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';
  jerseyNumber?: number;
  battingHand?: string;
  bowlingHand?: string;
  isWicketKeeper?: boolean;
}

@Component({
  selector: 'team-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onOverlayClick($event)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Team Players - {{ teamName() }}</h2>
            <button class="close-btn" (click)="close()">&times;</button>
          </div>

          <div class="modal-body">
            <div class="players-list">
              <h3>Players ({{ players().length }}/11)</h3>
              @if (players().length === 0) {
                <p class="empty-message">No players added yet</p>
              } @else {
                <div class="player-items">
                  @for (player of players(); track $index) {
                    <div class="player-item">
                      <div class="player-info">
                        <span class="player-number">
                          @if (player.jerseyNumber) {
                            #{{ player.jerseyNumber }}
                          } @else {
                            -
                          }
                        </span>
                        <span class="player-name">{{ player.name }}</span>
                        <span class="player-role">{{ player.role }}</span>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" (click)="close()">Close</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
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
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
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
      border-radius: 4px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f5f5f5;
      color: #333;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .player-form {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #1976d2;
    }

    .btn-add {
      width: 100%;
      padding: 0.75rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-add:hover {
      background: #1565c0;
    }

    .players-list h3 {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      color: #333;
    }

    .empty-message {
      text-align: center;
      color: #666;
      padding: 2rem;
      font-style: italic;
    }

    .player-items {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .player-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .player-item:hover {
      border-color: #1976d2;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .player-info {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex: 1;
    }

    .player-number {
      font-weight: bold;
      color: #1976d2;
      min-width: 40px;
    }

    .player-name {
      font-weight: 600;
      color: #333;
      flex: 1;
    }

    .player-role {
      color: #666;
      font-size: 0.875rem;
      background: #e3f2fd;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
    }

    .remove-btn {
      padding: 0.5rem 1rem;
      background: white;
      color: #f44336;
      border: 1px solid #f44336;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .remove-btn:hover {
      background: #f44336;
      color: white;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .btn-cancel, .btn-save {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: #f5f5f5;
      color: #666;
    }

    .btn-cancel:hover {
      background: #e0e0e0;
    }

    .btn-save {
      background: #4caf50;
      color: white;
    }

    .btn-save:hover:not(:disabled) {
      background: #45a049;
    }

    .btn-save:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class AddTeamCardModalComponent {
  @Input() set open(value: boolean) {
    this.isOpen.set(value);
  }
  @Input() set team(value: string) {
    this.teamName.set(value);
  }
  @Input() set matchId(value: string) {
    this._matchId.set(value);
  }
  @Input() set playersList(value: Player[]) {
    if (value && value.length > 0) {
      this.players.set(value);
    }
  }
  
  private _matchId = signal('');

  @Output() closeModal = new EventEmitter<void>();
  @Output() playersAdded = new EventEmitter<Player[]>();

  isOpen = signal(false);
  teamName = signal('');
  players = signal<Player[]>([]);

  playerName = '';
  playerRole: Player['role'] = 'Batsman';
  jerseyNumber?: number;
  battingHand = 'Right-hand bat';
  bowlingHand = 'Right-arm medium';
  isWicketKeeper = false;
  
  private matchService = inject(MatchService);
  private match = signal<Match | null>(null);

  close(): void {
    this.isOpen.set(false);
    this.playerName = '';
    this.playerRole = 'Batsman';
    this.jerseyNumber = undefined;
    this.battingHand = 'Right-hand bat';
    this.bowlingHand = 'Right-arm medium';
    this.isWicketKeeper = false;
    this.closeModal.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    this.close();
  }
}
