# Firestore Database Schema - Treasure Quest Gaming Platform

## Collections Structure

### 1. `players` Collection
Stores user account information with password hashing for security.

**Document ID**: `user_${timestamp}`

```
players/{userId}
  ├── username: string
  ├── passwordHash: string (hashed with PBKDF2)
  ├── currentLevel: number
  ├── totalGemsCollected: number
  ├── bestScores: { [levelId: number]: number }
  ├── levelsCompleted: number[]
  ├── soundEnabled: boolean
  ├── createdAt: timestamp
  └── lastUpdated: timestamp
```

### 2. `playerStats` Collection
Aggregated statistics for each player used in dashboards and leaderboards.

**Document ID**: Same as userId in `players`

```
playerStats/{userId}
  ├── userId: string
  ├── username: string
  ├── totalGamesPlayed: number
  ├── totalGemsCollected: number
  ├── totalPlayTime: number (seconds)
  ├── highestLevel: number
  ├── averageScore: number
  ├── lastPlayed: timestamp
  ├── createdAt: timestamp
  ├── favoriteGame: string
  ├── achievements: string[]
  └── totalSessions: number
```

### 3. `gameSessions` Collection (Subcollection)
Detailed records of each gaming session.

**Path**: `gameSessions/{userId}/{sessionId}`

**Session ID Format**: `${Date.now()}_${randomString}`

```
gameSessions/{userId}/{sessionId}
  ├── gameId: string ('treasure-quest')
  ├── gameName: string
  ├── startTime: timestamp
  ├── endTime: timestamp
  ├── duration: number (seconds)
  ├── levelReached: number
  ├── gemsCollected: number
  ├── score: number
  ├── completed: boolean
  └── timestamp: timestamp
```

## Data Flow

### User Registration
1. Create entry in `players/{userId}` with hashed password
2. Initialize `playerStats/{userId}` with zero values
3. Store userId in localStorage for session management

### Game Session Recording
1. Record game start with `sessionStartTime`
2. On game end or user exit:
   - Calculate `sessionDuration`
   - Create entry in `gameSessions/{userId}/{sessionId}`
   - Update `playerStats/{userId}` with aggregated data

### Dashboard Display
- **PlayerStats**: Fetched from `playerStats/{userId}`
- **Recent Sessions**: Fetched from `gameSessions/{userId}` (limited to 5)
- **Leaderboard**: Sorted by `averageScore` from all `playerStats` documents

## Real-Time Data Updates

All displayed data is dynamically loaded from Firestore:
- ✅ Games Played: Counted from `playerStats/totalGamesPlayed`
- ✅ Total Gems: From `playerStats/totalGemsCollected`
- ✅ Highest Level: From `playerStats/highestLevel`
- ✅ Play Time: From `playerStats/totalPlayTime` converted to hours
- ✅ Recent Sessions: From `gameSessions/{userId}` subcollection
- ✅ Average Score: From `playerStats/averageScore`
- ✅ Leaderboard Ranking: Calculated from all players' `averageScore`

## Security Rules (Firebase)

Recommended Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Players can only read/write their own data
    match /players/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /playerStats/{userId} {
      allow read: if true; // Public for leaderboard
      allow write: if request.auth.uid == userId;
    }
    match /gameSessions/{userId}/{sessionId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Key Features

1. **Real-Time Data**: All statistics update immediately after game sessions
2. **Automatic Aggregation**: Session data automatically updates player stats
3. **Leaderboard**: Dynamically calculated from playerStats collection
4. **Session History**: Complete game session history stored for analytics
5. **Password Security**: All passwords hashed with PBKDF2 before storage
