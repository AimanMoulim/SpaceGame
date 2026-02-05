# Firestore Setup Guide - Treasure Quest Platform

## Prerequisites
- Firebase project created
- Firestore database initialized (Production mode recommended)
- Firebase config added to `/lib/firebase.ts`

## Collections to Create

Create the following collections in your Firestore database:

### 1. Create `players` Collection
```
Collection ID: players
Document ID: Auto-generate or use user_${timestamp}
```

**Sample Document Structure:**
```json
{
  "username": "player1",
  "passwordHash": "hashed_password_here",
  "currentLevel": 1,
  "totalGemsCollected": 0,
  "bestScores": {},
  "levelsCompleted": [],
  "soundEnabled": true,
  "createdAt": 1700000000000,
  "lastUpdated": 1700000000000
}
```

### 2. Create `playerStats` Collection
```
Collection ID: playerStats
Document ID: Same as the userId in players collection
```

**Sample Document Structure:**
```json
{
  "userId": "user_1700000000000",
  "username": "player1",
  "totalGamesPlayed": 0,
  "totalGemsCollected": 0,
  "totalPlayTime": 0,
  "highestLevel": 1,
  "averageScore": 0,
  "lastPlayed": 1700000000000,
  "createdAt": 1700000000000,
  "favoriteGame": "treasure-quest",
  "achievements": [],
  "totalSessions": 0
}
```

### 3. Create `gameSessions` Subcollection
```
Path: gameSessions/{userId}/{sessionId}
Document ID: Auto-generate with format ${Date.now()}_${randomString}
```

**Sample Document Structure:**
```json
{
  "gameId": "treasure-quest",
  "gameName": "Treasure Quest",
  "startTime": 1700000000000,
  "endTime": 1700003600000,
  "duration": 3600,
  "levelReached": 5,
  "gemsCollected": 150,
  "score": 5000,
  "completed": true,
  "timestamp": 1700003600000
}
```

## Firebase Security Rules

Add these rules to your Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Players collection - users can only read/write their own
    match /players/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // PlayerStats collection - public read for leaderboard
    match /playerStats/{userId} {
      allow read: if true; // Public for leaderboard
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Game sessions - users can only read/write their own
    match /gameSessions/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Automatic Data Initialization

When a new user signs up:
1. A document is created in `players` collection
2. A corresponding document is automatically created in `playerStats` with zero values
3. Game sessions are recorded in `gameSessions/{userId}` subcollection

This is handled automatically by the `initializeUserProfile()` function in `/lib/firebaseService.ts`.

## Data Flow Overview

### 1. User Registration
```
UsernameSetup → initializeUserProfile()
    ↓
Creates: players/{userId}
Creates: playerStats/{userId} with initial values
```

### 2. Game Session
```
Game Starts → recordGameSession()
    ↓
Creates: gameSessions/{userId}/{sessionId}
Updates: playerStats/{userId} with aggregated stats
```

### 3. Dashboard Display
```
PlatformDashboard → getPlayerStats(userId)
    ↓
Fetches: playerStats/{userId}
Fetches: gameSessions/{userId} (limited to 5)
Displays: Real-time player statistics
```

### 4. Leaderboard Display
```
PlatformLeaderboard → getGlobalLeaderboard()
    ↓
Fetches: All playerStats documents
Sorts: By averageScore
Displays: Top 100 players globally
```

## Verification

### Check if data is being stored:
1. Go to Firebase Console → Firestore Database
2. Verify collections exist: `players`, `playerStats`, `gameSessions`
3. After playing a game, check if new session document appears

### Debug console:
```javascript
// In browser console
console.log(localStorage.getItem('treasureGameProgress'))
// Should show: { userId: "...", username: "...", ... }
```

## Common Issues

### Issue: Stats not updating on dashboard
**Solution**: Ensure `recordGameSession()` is called with correct userId when game ends

### Issue: Leaderboard showing empty
**Solution**: Verify playerStats collection exists and has documents with `averageScore` field

### Issue: Login failed with correct credentials
**Solution**: Check password hash matches - ensure `verifyPassword()` function works correctly

## Testing

1. Create a test account with username `testuser` and password `TestPass123`
2. Play the Treasure Quest game for a few levels
3. Check dashboard - stats should update
4. Check leaderboard - player should appear
5. Go to Firebase Console → Firestore to verify all documents created correctly
