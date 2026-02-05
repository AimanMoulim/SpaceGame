import { database } from './firebase'
import { ref, set, get, update } from 'firebase/database'

export interface GameProgress {
  username: string
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

export async function getUserByUsername(username: string): Promise<{ userId: string; profile: GameProgress } | null> {
  try {
    const playersRef = ref(database, 'players')
    const snapshot = await get(playersRef)
    if (!snapshot.exists()) return null
    
    const players = snapshot.val()
    for (const [userId, player] of Object.entries(players)) {
      if ((player as any).username?.toLowerCase() === username.toLowerCase()) {
        return { userId, profile: player as GameProgress }
      }
    }
    return null
  } catch (error) {
    console.error('Error getting user by username:', error)
    return null
  }
}

export async function initializeUserProfile(userId: string, username: string) {
  try {
    const userRef = ref(database, `players/${userId}`)
    await set(userRef, {
      username,
      currentLevel: 1,
      totalGemsCollected: 0,
      bestScores: {},
      levelsCompleted: [],
      soundEnabled: true,
      createdAt: Date.now(),
      lastUpdated: Date.now()
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
