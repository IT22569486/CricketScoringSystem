import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      @if (authService.currentUser(); as user) {
        <div class="profile-card">
          <h2>User Profile</h2>
          <div class="profile-info">
            <div class="info-item">
              <label>Username</label>
              <p>{{ user.username }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ user.email }}</p>
            </div>
            <div class="info-item">
              <label>User ID</label>
              <p>{{ user.id }}</p>
            </div>
          </div>
        </div>
      } @else {
        <p>Loading user profile...</p>
      }
    </div>
  `,
  styleUrls: ['./profile.scss']
})
export class ProfileComponent {
  authService = inject(AuthService);
}
