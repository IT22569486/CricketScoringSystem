import { Routes } from '@angular/router';
import { authGuard } from '../../src/app/guards/auth.guard';
import { LoginComponent } from '../../src/app/pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ProfileComponent } from './pages/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) , canActivate: [authGuard]},
  { path: 'matches', loadComponent: () => import('./pages/matches/matches.component').then(m => m.MatchesComponent) , canActivate: [authGuard]},
  { path: 'create-match', loadComponent: () => import('./pages/createMactch/createMatch.component').then(m => m.createMatchComponent) },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
    // { path: 'matches', loadComponent: () => import('./pages/match-list/match-list.component').then(m => m.MatchListComponent), canActivate: [authGuard] },
  { path: 'score/:id', loadComponent: () => import('./pages/score/score.component').then(m => m.ScoreComponent), canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    // { path: '', redirectTo: '/matches', pathMatch: 'full' },
    // { path: '**', redirectTo: '/matches' }
];
