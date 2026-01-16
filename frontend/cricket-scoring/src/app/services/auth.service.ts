import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

const USER_KEY = 'cricket_user';
const TOKEN_KEY = 'cricket_auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  currentUser = signal<UserProfile | null>(this.getUserFromStorage());
  isAuthenticated = signal<boolean>(!!this.getToken());

  constructor(private http: HttpClient, private router: Router) { }

  register(data: any): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => this.setSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, authResult.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authResult.user));
    this.currentUser.set(authResult.user);
    this.isAuthenticated.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private getUserFromStorage(): UserProfile | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}