# Game Data Synchronization System

## Overview
The game platform now has a complete real-time data synchronization system where all player game results are automatically captured, stored in Firestore, and displayed on the platform dashboard.

## Data Flow Architecture

### 1. Game Session Capture (treasure-quest/page.tsx)
- Wraps GameScreenPC and GameScreenMobile components
- Periodically captures game data (gems, level, score) every 500ms
- Stores in `sessionDataRef` for final submission
- On page unload, records complete session with real data

### 2. Data Recording (platformService.ts)
```
recordGameSession(userId, gameSession)
  ├─ Store session in Firestore: gameSessions/{userId}/{sessionId}
  └─ Update player stats:
     ├─ totalGamesPlayed += 1
     ├─ totalGemsCollected += session.gemsCollected
     ├─ totalPlayTime += session.duration
     ├─ highestLevel = max(current, session.levelReached)
     ├─ averageScore = recalculated average
     └─ lastPlayed = current timestamp
```

### 3. Real-Time Display (PlatformDashboard)
- Displays stats from playerStats collection:
  - Games Played: totalGamesPlayed
  - Total Gems: totalGemsCollected
  - Highest Level: highestLevel
  - Play Time: totalPlayTime converted to hours

### 4. Last Session Widget (LastGameSession)
- Loads the most recent game session
- Displays:
  - 💎 Gems Collected
  - 🏔️ Level Reached
  - ⭐ Score
  - ⏱️ Duration
  - Completion Status
  - Play Date & Time

## Firestore Collections

### gameSessions/{userId}/{sessionId}
```json
{
  "gameId": "treasure-quest",
  "gameName": "Treasure Quest",
  "startTime": 1704067200000,
  "endTime": 1704067320000,
  "duration": 120,
  "levelReached": 3,
  "gemsCollected": 42,
  "score": 420,
  "completed": true,
  "timestamp": 1704067320000
}
```

### playerStats/{userId}
```json
{
  "userId": "user_1234567890",
  "username": "gamer_pro",
  "totalGamesPlayed": 5,
  "totalGemsCollected": 187,
  "totalPlayTime": 1200,
  "highestLevel": 4,
  "averageScore": 285,
  "lastPlayed": 1704067320000,
  "favoriteGame": "treasure-quest",
  "achievements": [],
  "createdAt": 1704000000000
}
```

## Data Synchronization Flow

```
Player plays game
    ↓
GameEngine captures game state
    ↓
GameScreenPCWithCapture/GameScreenMobileWithCapture
    ├─ Polls gameEngineRef every 500ms
    └─ Extracts: gems, levelReached, score, completed
    ↓
sessionDataRef updated with real values
    ↓
Player exits/leaves page
    ↓
useEffect cleanup executes recordGameSession()
    ↓
Firebase stores complete session data
    ↓
playerStats automatically updated with aggregated data
    ↓
PlatformDashboard and LastGameSession read from playerStats
    ↓
UI displays real, current player data
```

## Key Features

✅ **Automatic Data Capture**: Game data automatically extracted from GameEngine
✅ **Real-Time Stats**: Dashboard shows exact accumulated stats
✅ **Session History**: Every game session stored with complete data
✅ **Persistent Storage**: All data in Firestore for permanent records
✅ **Accurate Calculations**: Average scores, totals calculated in real-time
✅ **User-Specific Data**: Each player sees only their own stats and sessions

## How to Verify It Works

1. **Create an account** and log in
2. **Play a game** and collect gems, reach levels
3. **Exit the game** (page unmount triggers save)
4. **Check Dashboard**:
   - Stats should update immediately
   - Games Played count increases by 1
   - Total Gems shows exact collected amount
   - Last Game Session widget shows exact results

## Components & Files

- **treasure-quest/page.tsx** - Session capture and data submission
- **GameSessionCapture.tsx** - Polling mechanism (optional wrapper)
- **LastGameSession.tsx** - Real-time session display widget
- **PlatformDashboard.tsx** - Main stats display with LastGameSession
- **platformService.ts** - Firestore operations and stat calculations
- **firebaseService.ts** - Player initialization with stats collection

## Example Flow

```
User plays Treasure Quest:
  • Collects 45 gems from level 3
  • Plays for 2 minutes 30 seconds
  • Reaches level 4

Exit game:
  • Session recorded: 
    - gemsCollected: 45
    - levelReached: 4
    - duration: 150
    - score: 450

Dashboard updates:
  • Total Gems: 45 (or more if previous sessions)
  • Highest Level: 4
  • Play Time: +2m 30s
  • Average Score: includes this session

Last Session Widget:
  • 💎 45 Gems
  • 🏔️ Level 4
  • ⭐ 450 Points
  • ⏱️ 2m 30s
```

---

**Result**: Platform is now a 100% real-time representation of what every player actually plays and achieves!
