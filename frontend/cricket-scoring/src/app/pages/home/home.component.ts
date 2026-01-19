import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <h1>Cricket Scoring System</h1>
      <p>Welcome to the Cricket Match Scoring Application</p>
      
      <div class="actions">
        <button [routerLink]="['/matches']" class="btn-primary">View Matches</button>
        <button [routerLink]="['/score']" class="btn-secondary">Start Scoring</button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      text-align: center;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #1976d2;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      color: #666;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    button {
      padding: 1rem 2rem;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1565c0;
    }

    .btn-secondary {
      background-color: #4caf50;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #45a049;
    }
  `]
})
export class HomeComponent {}
