import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-form">
        <h2>Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" formControlName="username" required>
            <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
              <p class="error-message">Username is required.</p>
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" formControlName="email" required>
            <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              <p class="error-message">Please enter a valid email.</p>
            </div>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="password" required>
            <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              <p class="error-message">Password must be at least 6 characters.</p>
            </div>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" formControlName="confirmPassword" required>
            <div *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
              <p class="error-message">Passwords do not match.</p>
            </div>
          </div>
          <div *ngIf="errorMessage" class="error-message server-error">
            {{ errorMessage }}
          </div>
          <button type="submit" [disabled]="registerForm.invalid">Register</button>
        </form>
        <p class="switch-form">
          Already have an account? <a routerLink="/login">Login here</a>
        </p>
      </div>
    </div>
  `,
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registrationData } = this.registerForm.value;
      this.authService.register(registrationData).subscribe({
        next: () => {
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err) => this.errorMessage = err.error || 'Registration failed. Please try again.'
      });
    }
  }
}
