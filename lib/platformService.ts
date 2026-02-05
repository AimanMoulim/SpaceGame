import { database } from './firebase'
import { ref, set, get, update, query, orderByChild, limitToTop } from 'firebase/database'

export interface PlayerStats {
  totalGamesPlayed: number
  totalGemsCollected: number
  totalPlayTime: number
  highestLevel: number
  averageScore: number
  lastPlayed: number
  favoriteGame: string
  achievements: string[]
}

export interface GameSession {
  gameId: string
  gameName: string
  startTime: number
  endTime?: number
  duration?: number
  levelReached: number
  gemsCollected: number
  score: number
  completed: boolean
}

export interface LeaderboardEntry {
  userId: string
  username: string
  score: number
  level: number
  totalGems: number
  rank: number
  lastPlayed: number
}

// Initialize or update player statistics
export async function updatePlayerStats(userId: string, stats: Partial<PlayerStats>) {
  try {
    const playerStatsRef = ref(database, `playerStats/${userId}`)
    await update(playerStatsRef, {
      ...stats,
      lastUpdated: Date.now()
    })
    return true
  } catch (error) {
    console.error('Error updating player stats:', error)
    return false
  }
}

// Get player statistics
export async function getPlayerStats(userId: string): Promise<PlayerStats | null> {
  try {
    const playerStatsRef = ref(database, `playerStats/${userId}`)
    const snapshot = await get(playerStatsRef)
    if (snapshot.exists()) {
      return snapshot.val() as PlayerStats
    }
    return null
  } catch (error) {
    console.error('Error getting player stats:', error)
    return null
  }
}

// Record game session
export async function recordGameSession(userId: string, session: GameSession) {
  try {
    const sessionId = `${Date.now()}`
    const sessionRef = ref(database, `gameSessions/${userId}/${sessionId}`)
    await set(sessionRef, {
      ...session,
      timestamp: Date.now()
    })

    // Update player stats
    const currentStats = await getPlayerStats(userId)
    if (currentStats) {
      await updatePlayerStats(userId, {
        totalGamesPlayed: (currentStats.totalGamesPlayed || 0) + 1,
        totalGemsCollected: (currentStats.totalGemsCollected || 0) + session.gemsCollected,
        totalPlayTime: (currentStats.totalPlayTime || 0) + (session.duration || 0),
        highestLevel: Math.max(currentStats.highestLevel || 0, session.levelReached),
        averageScore: ((currentStats.averageScore || 0) + session.score) / 2,
        lastPlayed: Date.now()
      })
    }

    return true
  } catch (error) {
    console.error('Error recording game session:', error)
    return false
  }
}

// Get player game sessions
export async function getPlayerSessions(userId: string, limit: number = 10): Promise<GameSession[]> {
  try {
    const sessionsRef = ref(database, `gameSessions/${userId}`)
    const snapshot = await get(sessionsRef)
    if (snapshot.exists()) {
      const sessions = Object.values(snapshot.val()) as GameSession[]
      return sessions.slice(0, limit)
    }
    return []
  } catch (error) {
    console.error('Error getting player sessions:', error)
    return []
  }
}

// Get global leaderboard
export async function getGlobalLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const leaderboardRef = ref(database, 'playerStats')
    const snapshot = await get(leaderboardRef)
    if (snapshot.exists()) {
      const entries: LeaderboardEntry[] = []
      let rank = 1
      const stats = snapshot.val()
      
      const sorted = Object.entries(stats)
        .map(([userId, data]: [string, any]) => ({
          userId,
          username: data.username || 'Unknown',
          score: data.averageScore || 0,
          level: data.highestLevel || 0,
          totalGems: data.totalGemsCollected || 0,
          lastPlayed: data.lastPlayed || 0
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

      return sorted.map(entry => ({
        ...entry,
        rank: rank++
      }))
    }
    return []
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}

// Get player profile summary
export async function getPlayerProfile(userId: string) {
  try {
    const playerRef = ref(database, `players/${userId}`)
    const statsRef = ref(database, `playerStats/${userId}`)

    const [playerSnapshot, statsSnapshot] = await Promise.all([
      get(playerRef),
      get(statsRef)
    ])

    return {
      profile: playerSnapshot.exists() ? playerSnapshot.val() : null,
      stats: statsSnapshot.exists() ? statsSnapshot.val() : null
    }
  } catch (error) {
    console.error('Error getting player profile:', error)
    return { profile: null, stats: null }
  }
}
