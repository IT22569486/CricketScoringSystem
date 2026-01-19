# Cricket Scoring System

A full-stack web application for managing and scoring cricket matches in real-time. Built with **ASP.NET Core 8** backend, **Angular 20** frontend, and **Firebase Firestore** for data persistence.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Firebase Setup](#firebase-setup)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

- **User Authentication**: Secure login/registration with JWT token-based authentication
- **Match Management**: Create, view, and manage cricket matches
- **Real-time Scoring**: Update match scores in real-time with live updates
- **Player Management**: Add and manage players for teams
- **Team Management**: Create and manage cricket teams
- **User Profiles**: View and manage user profiles
- **Responsive UI**: Modern Angular-based responsive frontend
- **Firebase Integration**: Cloud-hosted data with Firestore

## 🛠 Tech Stack

### Backend
- **.NET 8** - Latest LTS version of .NET
- **ASP.NET Core** - Web API framework
- **Firebase Admin SDK** - Server-side authentication and Firestore integration
- **JWT Authentication** - Secure token-based auth
- **Google Cloud Firestore** - NoSQL database

### Frontend
- **Angular 20** - Modern TypeScript-based framework
- **SCSS** - Advanced styling
- **Angular Router** - Client-side routing
- **AngularFire** - Firebase integration library
- **Reactive Forms** - Form handling with RxJS
- **HTTP Client** - API communication

### Infrastructure
- **Firebase Firestore** - Cloud database
- **Firebase Authentication** - Auth service
- **Google Cloud Project** - Cloud infrastructure

## Project Structure

```
CricketScoringSystem/
├── backend/
│   └── CricketScoring.Api/
│       ├── Controllers/           # API endpoints
│       │   ├── AuthController.cs
│       │   └── MatchesController.cs
│       ├── Services/              # Business logic
│       │   ├── AuthService.cs
│       │   ├── FirestoreService.cs
│       │   └── IFirestoreService.cs
│       ├── Models/                # Data models
│       │   ├── Match.cs
│       │   └── User.cs
│       ├── DTOs/                  # Data transfer objects
│       │   ├── MatchDto.cs
│       │   └── UserDto.cs
│       ├── Properties/            # Configuration
│       ├── Program.cs             # Application startup
│       ├── appsettings.json       # Configuration settings
│       └── CricketScoring.Api.csproj
├── frontend/
│   └── cricket-scoring/           # Angular application
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/    # Reusable components
│       │   │   ├── pages/         # Page components
│       │   │   │   ├── home/
│       │   │   │   ├── login/
│       │   │   │   ├── register/
│       │   │   │   ├── profile/
│       │   │   │   ├── matches/
│       │   │   │   ├── createMatch/
│       │   │   │   └── score/
│       │   │   ├── services/      # API services
│       │   │   ├── guards/        # Route guards
│       │   │   └── app.routes.ts  # Route configuration
│       │   ├── environments/      # Environment configs
│       │   └── main.ts            # Application entry point
│       ├── package.json
│       └── angular.json
├── CricketScoringSystem.sln       # Solution file
├── FIREBASE_SETUP.md              # Firebase configuration guide
└── README.md                       # This file

## Prerequisites

Before getting started, ensure you have the following installed:

- **.NET SDK 8.0+** - [Download](https://dotnet.microsoft.com/download)
  ```powershell
  dotnet --version
  ```

- **Node.js LTS (v18+)** - [Download](https://nodejs.org/)
  ```powershell
  node --version
  ```

- **npm (v9+)** - Usually installed with Node.js
  ```powershell
  npm --version
  ```

- **Angular CLI 20+** - Install globally
  ```powershell
  npm install -g @angular/cli@20
  ng version
  ```

- **Firebase CLI** - For Firebase emulators and deployment
  ```powershell
  npm install -g firebase-tools
  firebase --version
  ```

- **Git** - For version control
  ```powershell
  git --version
  ```

## Installation & Setup

### 1. Clone the Repository

```powershell
git clone https://github.com/yourusername/CricketScoringSystem.git
cd CricketScoringSystem
```

### 2. Backend Setup

```powershell
# Navigate to backend directory
cd backend/CricketScoring.Api

# Restore NuGet packages
dotnet restore

# Build the backend
dotnet build -c Debug

# Return to root
cd ../..
```

### 3. Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend/cricket-scoring

# Install npm dependencies
npm install

# Return to root
cd ../..
```

### 4. Firebase Configuration

Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md) to:
- Create a Firebase project
- Generate service account credentials
- Configure environment variables
- Set up Firestore database

**Quick Firebase Setup:**

```powershell
# Login to Firebase
firebase login

# Set your project
firebase use your-project-id

# Initialize emulators (optional for local development)
firebase emulators:start
```

## Running the Application

### Option 1: Run Both Backend & Frontend Simultaneously

**Terminal 1 - Backend:**
```powershell
cd backend/CricketScoring.Api
dotnet watch run
```

**Terminal 2 - Frontend:**
```powershell
cd frontend/cricket-scoring
npm start
```

Then access the application at: **http://localhost:4200**

### Option 2: Run Individually

**Backend Only:**
```powershell
dotnet run --project .\backend\CricketScoring.Api
# API runs on: https://localhost:7191
```

**Frontend Only:**
```powershell
cd frontend/cricket-scoring
ng serve -o
# Opens: http://localhost:4200
```

### With Hot Reload

**Backend** (with file watching):
```powershell
dotnet watch --project .\backend\CricketScoring.Api run
```

**Frontend** (automatic refresh):
```powershell
ng serve
```

## Configuration

### Backend Configuration

**appsettings.json** - Database and service configuration
```json
{
  "Firebase": {
    "ProjectId": "your-project-id",
    "CredentialsPath": "path/to/service-account.json"
  }
}
```

**User Secrets** (for sensitive data):
```powershell
# Initialize secrets storage
dotnet user-secrets init --project .\backend\CricketScoring.Api

# Set Firebase project ID
dotnet user-secrets set "Firebase:ProjectId" "your-project-id" `
  --project .\backend\CricketScoring.Api

# Set credentials path
dotnet user-secrets set "Firebase:CredentialsPath" `
  "C:\path\to\service-account.json" `
  --project .\backend\CricketScoring.Api

# Verify secrets
dotnet user-secrets list --project .\backend\CricketScoring.Api
```

### Frontend Configuration

**environment.ts** - Production environment
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:7191',
  firebase: {
    projectId: 'your-project-id',
    // ... other Firebase config
  }
};
```

**environment.development.ts** - Development environment
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:7191',
  firebase: {
    projectId: 'your-project-id',
    // ... other Firebase config
  }
};
```

### CORS Configuration

The backend CORS policy is configured in `Program.cs`:
- **Allowed Origins**: `http://localhost:4200`, `http://localhost:7191`
- **Methods**: All HTTP methods
- **Headers**: All headers
- **Credentials**: Enabled

Update these values in production.

## API Documentation

### Authentication Endpoints

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "User Name"
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Match Endpoints

**Get All Matches**
```
GET /api/matches
Authorization: Bearer {token}
```

**Create Match**
```
POST /api/matches
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Match Title",
  "teamA": "Team A",
  "teamB": "Team B",
  "date": "2026-01-21T14:00:00Z"
}
```

**Get Match Details**
```
GET /api/matches/{id}
Authorization: Bearer {token}
```

**Update Match**
```
PUT /api/matches/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Delete Match**
```
DELETE /api/matches/{id}
Authorization: Bearer {token}
```

For complete API documentation, use Swagger UI available at: **https://localhost:7191/swagger**

## Frontend Documentation

### Project Structure

- **components/** - Reusable components (TeamCard, AddPlayerModal, etc.)
- **pages/** - Page-level components (Home, Login, Register, etc.)
- **services/** - API services (AuthService, MatchService)
- **guards/** - Route protection (AuthGuard)
- **environments/** - Environment configurations

### Key Services

**AuthService** - User authentication
```typescript
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

const authService = inject(AuthService);
authService.login(email, password).subscribe(/* ... */);
```

**MatchService** - Match management
```typescript
const matchService = inject(MatchService);
matchService.getMatches().subscribe(matches => {
  // Handle matches
});
```

### Routing

Routes are configured in `app.routes.ts`:
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/profile` - User profile
- `/matches` - Matches list
- `/create-match` - Create new match
- `/score/:id` - Score match

## Firebase Setup

Complete Firebase setup instructions are available in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

**Quick Reference:**

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Download service account JSON from Firebase Console → Project Settings → Service Accounts
3. Configure backend with credentials
4. Enable Firestore database
5. Create Firestore security rules
6. (Optional) Set up Firebase Emulator Suite for local development

## Troubleshooting

### Backend Issues

**"Firebase ProjectId is not configured"**
- Ensure `Firebase:ProjectId` is set via user secrets or `appsettings.json`
- Check user secrets: `dotnet user-secrets list`

**"Firebase credentials file not found"**
- Verify the service account JSON file path
- Use absolute path in configuration
- Check file permissions

**"CORS error when calling API from frontend"**
- Verify frontend origin is in CORS allowed list in `Program.cs`
- Check backend is running on expected port
- Clear browser cache and restart dev server

### Frontend Issues

**"Cannot GET /api/..." errors**
- Ensure backend is running on `http://localhost:7191`
- Check `apiUrl` in environment configuration
- Verify route in backend controller exists

**"Firebase authentication error"**
- Check Firebase configuration in `environment.ts`
- Ensure Firebase project credentials are correct
- Verify Firestore database rules allow access

**"Angular routing not working"**
- Clear browser cache
- Verify routes in `app.routes.ts`
- Check lazy-loaded modules are properly configured

### Common Commands for Debugging

```powershell
# Check .NET version
dotnet --version

# Check npm packages
npm list

# Check Angular version
ng version

# Rebuild backend
dotnet clean
dotnet build

# Clear npm cache and reinstall
npm cache clean --force
npm install

# Check Firebase CLI status
firebase --version
firebase projects:list
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/yourusername/CricketScoringSystem/issues) on GitHub.

---

**Last Updated**: January 2026
**Status**: Active Development