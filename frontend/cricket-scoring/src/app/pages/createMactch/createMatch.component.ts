import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatchService, CreateMatchRequest } from '../../services/match.service';

@Component({
  selector: 'app-create-match',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="create-match-container">
      <h1>{{ isEditMode() ? 'Update Match' : 'Create New Match' }}</h1>
      
      <form [formGroup]="matchForm" (ngSubmit)="onSubmit()" class="match-form">
        <div class="form-grid">
          <!-- Team 1 -->
          <div class="form-group">
            <label for="team1">Team 1 *</label>
            <input 
              id="team1"
              type="text" 
              formControlName="team1"
              placeholder="e.g., India"
              [class.error]="matchForm.get('team1')?.invalid && matchForm.get('team1')?.touched"
            />
            @if (matchForm.get('team1')?.invalid && matchForm.get('team1')?.touched) {
              <span class="error-message">Team 1 name is required</span>
            }
          </div>

          <!-- Team 2 -->
          <div class="form-group">
            <label for="team2">Team 2 *</label>
            <input 
              id="team2"
              type="text" 
              formControlName="team2"
              placeholder="e.g., Australia"
              [class.error]="matchForm.get('team2')?.invalid && matchForm.get('team2')?.touched"
            />
            @if (matchForm.get('team2')?.invalid && matchForm.get('team2')?.touched) {
              <span class="error-message">Team 2 name is required</span>
            }
          </div>

          <!-- Venue -->
          <div class="form-group">
            <label for="venue">Venue *</label>
            <input 
              id="venue"
              type="text" 
              formControlName="venue"
              placeholder="e.g., Mumbai Stadium"
              [class.error]="matchForm.get('venue')?.invalid && matchForm.get('venue')?.touched"
            />
            @if (matchForm.get('venue')?.invalid && matchForm.get('venue')?.touched) {
              <span class="error-message">Venue is required</span>
            }
          </div>

          <!-- Match Date -->
          <div class="form-group">
            <label for="matchDate">Match Date & Time *</label>
            <input 
              id="matchDate"
              type="datetime-local" 
              formControlName="matchDate"
              [class.error]="matchForm.get('matchDate')?.invalid && matchForm.get('matchDate')?.touched"
            />
            @if (matchForm.get('matchDate')?.invalid && matchForm.get('matchDate')?.touched) {
              <span class="error-message">Match date is required</span>
            }
          </div>

          <!-- Match Type -->
          <div class="form-group">
            <label for="matchType">Match Type *</label>
            <select 
              id="matchType"
              formControlName="matchType"
              [class.error]="matchForm.get('matchType')?.invalid && matchForm.get('matchType')?.touched"
            >
              <option value="">Select Match Type</option>
              <option value="T20">T20</option>
              <option value="ODI">ODI</option>
              <option value="Test">Test</option>
            </select>
            @if (matchForm.get('matchType')?.invalid && matchForm.get('matchType')?.touched) {
              <span class="error-message">Match type is required</span>
            }
          </div>

          <!-- Toss Winner (Optional) -->
          <div class="form-group">
            <label for="tossWinner">Toss Winner (Optional)</label>
            <select id="tossWinner" formControlName="tossWinner">
              <option value="">Not decided yet</option>
              <option [value]="matchForm.get('team1')?.value">{{ matchForm.get('team1')?.value || 'Team 1' }}</option>
              <option [value]="matchForm.get('team2')?.value">{{ matchForm.get('team2')?.value || 'Team 2' }}</option>
            </select>
          </div>

          <!-- Toss Decision (Optional) -->
          <div class="form-group">
            <label for="tossDecision">Toss Decision (Optional)</label>
            <select id="tossDecision" formControlName="tossDecision">
              <option value="">Not decided yet</option>
              <option value="Bat">Bat</option>
              <option value="Bowl">Bowl</option>
            </select>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" [routerLink]="['/matches']">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="matchForm.invalid || isSubmitting()">
            {{ isSubmitting() ? 'Creating...' : 'Create Match' }}
          </button>
        </div>

        @if (errorMessage()) {
          <div class="error-banner">{{ errorMessage() }}</div>
        }
      </form>
    </div>
  `,
  styles: [`
    .score-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #333;
    }

    .match-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #333;
      font-size: 0.9rem;
    }

    input, select {
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #1976d2;
    }

    input.error, select.error {
      border-color: #d32f2f;
    }

    .error-message {
      color: #d32f2f;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1565c0;
    }

    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
    }

    .btn-secondary:hover {
      background-color: #e0e0e0;
    }

    .error-banner {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #ffebee;
      color: #c62828;
      border-radius: 4px;
      border-left: 4px solid #d32f2f;
    }
  `]
})
export class createMatchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private matchService = inject(MatchService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  matchForm!: FormGroup;
  isEditMode = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.initializeForm();

    // Check if we're editing an existing match
    const matchId = this.route.snapshot.paramMap.get('id');
    if (matchId) {
      this.isEditMode.set(true);
      this.loadMatch(matchId);
    }
  }

  initializeForm(): void {
    this.matchForm = this.fb.group({
      team1: ['', Validators.required],
      team2: ['', Validators.required],
      venue: ['', Validators.required],
      matchDate: ['', Validators.required],
      matchType: ['', Validators.required]
    });
  }

  loadMatch(id: string): void {
    this.matchService.getMatch(id).subscribe({
      next: (match) => {
        // Convert ISO date to datetime-local format
        const localDate = new Date(match.matchDate).toISOString().slice(0, 16);
        
        this.matchForm.patchValue({
          team1: match.team1,
          team2: match.team2,
          venue: match.venue,
          matchDate: localDate,
          matchType: match.matchType
        });
      },
      error: (err) => {
        console.error('Error loading match', err);
        this.errorMessage.set('Failed to load match details');
      }
    });
  }

  onSubmit(): void {
    if (this.matchForm.invalid) {
      this.matchForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const formValue = this.matchForm.value;
    const matchData: CreateMatchRequest = {
      team1: formValue.team1,
      team2: formValue.team2,
      venue: formValue.venue,
      matchDate: new Date(formValue.matchDate),
      matchType: formValue.matchType,
      team1Players: [],  // Empty array for now - can be populated later
      team2Players: []   // Empty array for now - can be populated later
    };

    this.matchService.createMatch(matchData).subscribe({
      next: (createdMatch) => {
        console.log('Match created successfully', createdMatch);
        this.router.navigate(['/matches']);
      },
      error: (err) => {
        console.error('Error creating match', err);
        this.errorMessage.set('Failed to create match. Please try again.');
        this.isSubmitting.set(false);
      }
    });
  }
}
