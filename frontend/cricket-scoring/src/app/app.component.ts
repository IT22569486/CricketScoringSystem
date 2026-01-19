import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../src/app/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, HttpClientModule],
  template: `
    <header>
      <nav class="navbar">
        <div class="nav-container">
          <a routerLink="/home" class="nav-brand">Cricket Scoring</a>
          <div class="nav-links">
            @if (authService.isAuthenticated()) {
            <a routerLink="/home" routerLinkActive="active">Home</a>
            <a routerLink="/matches" routerLinkActive="active">Matches</a>
            <a routerLink="/score" routerLinkActive="active">Score</a>
            <button (click)="logout()">Logout</button>

            } @else {
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" routerLinkActive="active">Register</a>
            }
          </div>
        </div>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cricket-scoring';
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}