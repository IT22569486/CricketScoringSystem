import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Match, MatchService } from '../../services/match.service';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="matches-container">
      <h1>Cricket Matches</h1>
      
      <div class="matches-list">
        @for (match of matches(); track match.id) {
          <div class="match-card">
            <div class="match-header">
              <!-- <span class="status-badge" [class]="match.status?.toLowerCase() || 'upcoming'">{{ (match.status || 'Upcoming') | uppercase }}</span> -->
              <span class="date">{{ match.matchDate | date: 'short' }}</span>
            </div>
            <div class="teams">
              <h3>{{ match.team1 }} vs {{ match.team2 }}</h3>
              <p class="venue">{{ match.venue }}</p>
            </div>
            <div class="actions">
              <button [routerLink]="['/score', match.id]" class="btn">Score</button>
              <button (click)="deleteMatch(match.id)" class="btn btn-delete">Delete</button>
            </div>
          </div>
        } @empty {
          <p class="empty-state">No matches available. Create a new match to get started.</p>
        }
      </div>

      <button class="btn-create" [routerLink]="['/create-match']">+ Create New Match</button>
    </div>
  `,
  styles: [`
    .matches-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #333;
    }

    .matches-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .match-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    .match-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .match-card.live {
      border-left: 4px solid #4caf50;
    }

    .match-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .status-badge.upcoming {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-badge.live {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .status-badge.completed {
      background-color: #f5f5f5;
      color: #757575;
    }

    .date {
      font-size: 0.875rem;
      color: #666;
    }

    .teams {
      flex-grow: 1;
    }

    .teams h3 {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
      color: #333;
    }
    
    .venue {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .btn:hover {
      background-color: #1565c0;
    }
    
    .btn-delete {
        background-color: #d32f2f;
    }

    .btn-delete:hover {
        background-color: #c62828;
    }

    .btn-create {
      padding: 1rem 2rem;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      display: block;
      margin: 0 auto;
    }

    .btn-create:hover {
      background-color: #45a049;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #999;
      font-size: 1.125rem;
      grid-column: 1 / -1;
    }
  `]
})
export class MatchesComponent implements OnInit {
  private matchService = inject(MatchService);
  matches = signal<Match[]>([]);

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.matchService.getMatches().subscribe({
      next: (data) => this.matches.set(data),
      error: (err) => console.error('Error fetching matches', err)
    });
  }

  deleteMatch(id: string): void {
    if (confirm('Are you sure you want to delete this match?')) {
      this.matchService.deleteMatch(id).subscribe({
        next: () => {
          this.matches.update(matches => matches.filter(m => m.id !== id));
        },
        error: (err) => console.error(`Error deleting match ${id}`, err)
      });
    }
  }
}
