import { database } from './firebase'
import { ref, set, get, update } from 'firebase/database'
import { hashPassword, verifyPassword } from './passwordHash'

export interface GameProgress {
  username: string
  passwordHash: string
  currentLevel: number
  totalGemsCollected: number
  bestScores: { [levelId: number]: number }
  levelsCompleted: number[]
  soundEnabled: boolean
  lastPlayed: number
}

export async function saveUserProgress(userId: string, progress: Partial<GameProgress>) {
  try {
    const userRef = ref(database, `players/${userId}`)
    await update(userRef, {
      ...progress,
      lastUpdated: Date.now()
    })
    return true
  } catch (error) {
    console.error('Error saving progress:', error)
    return false
  }
}

export async function getUserProgress(userId: string): Promise<GameProgress | null> {
  try {
    const userRef = ref(database, `players/${userId}`)
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      return snapshot.val() as GameProgress
    }
    return null
  } catch (error) {
    console.error('Error fetching progress:', error)
    return null
  }
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const playersRef = ref(database, 'players')
    const snapshot = await get(playersRef)
    if (!snapshot.exists()) return false
    
    const players = snapshot.val()
    return Object.values(players).some((player: any) => 
      player.username?.toLowerCase() === username.toLowerCase()
    )
  } catch (error) {
    console.error('Error checking username:', error)
    return false
  }
}

export async function getUserByUsername(username: string, password?: string): Promise<{ userId: string; profile: GameProgress } | null> {
  try {
    const playersRef = ref(database, 'players')
    const snapshot = await get(playersRef)
    if (!snapshot.exists()) return null
    
    const players = snapshot.val()
    for (const [userId, player] of Object.entries(players)) {
      const playerData = player as any
      if (playerData.username?.toLowerCase() === username.toLowerCase()) {
        // If password is provided, verify it
        if (password) {
          const isValid = await verifyPassword(password, playerData.passwordHash)
          if (!isValid) {
            return null // Wrong password
          }
        }
        return { userId, profile: playerData as GameProgress }
      }
    }
    return null
  } catch (error) {
    console.error('Error getting user by username:', error)
    return null
  }
}

export async function initializeUserProfile(userId: string, username: string, password: string) {
  try {
    // Hash the password
    const passwordHash = await hashPassword(password)
    
    const userRef = ref(database, `players/${userId}`)
    await set(userRef, {
      username,
      passwordHash,
      currentLevel: 1,
      totalGemsCollected: 0,
      bestScores: {},
      levelsCompleted: [],
      soundEnabled: true,
      createdAt: Date.now(),
      lastUpdated: Date.now()
    })

    // Initialize player stats collection
    const playerStatsRef = ref(database, `playerStats/${userId}`)
    await set(playerStatsRef, {
      userId,
      username,
      totalGamesPlayed: 0,
      totalGemsCollected: 0,
      totalPlayTime: 0,
      highestLevel: 1,
      averageScore: 0,
      lastPlayed: Date.now(),
      createdAt: Date.now(),
      favoriteGame: 'treasure-quest',
      achievements: [],
      totalSessions: 0
    })

    return true
  } catch (error) {
    console.error('Error initializing user profile:', error)
    return false
  }
}

export async function updateLevelStats(userId: string, levelId: number, gems: number, completed: boolean) {
  try {
    const userRef = ref(database, `players/${userId}`)
    const currentProgress = await getUserProgress(userId)
    
    if (!currentProgress) return false

    const bestScores = currentProgress.bestScores || {}
    const levelsCompleted = currentProgress.levelsCompleted || []

    // Update best score for this level
    if (!bestScores[levelId] || gems > bestScores[levelId]) {
      bestScores[levelId] = gems
    }

    // Track completed levels
    if (completed && !levelsCompleted.includes(levelId)) {
      levelsCompleted.push(levelId)
    }

    await update(userRef, {
      bestScores,
      levelsCompleted,
      totalGemsCollected: (currentProgress.totalGemsCollected || 0) + gems,
      currentLevel: Math.max(currentProgress.currentLevel, levelId),
      lastUpdated: Date.now()
    })
    return true
  } catch (error) {
    console.error('Error updating level stats:', error)
    return false
  }
}
