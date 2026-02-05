/**
 * Game Screen Component
 * Main game component that manages game states and transitions
 */

'use client'

import { useState, useEffect } from 'react'
import { GameCanvas } from './GameCanvas'
import { MainMenu } from './MainMenu'
import { LevelComplete } from './LevelComplete'
import { GameOver } from './GameOver'
import { UsernameSetup } from './UsernameSetup'
import { getLevelById, getNextLevel } from '@/lib/levels'
import { getUserProgress, saveUserProgress, updateLevelStats } from '@/lib/firebaseService'
import type { Level } from '@/lib/gameEngine'

type GameState = 'setup' | 'menu' | 'playing' | 'levelComplete' | 'gameOver'

export function GameScreen() {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null)
  const [currentLevelId, setCurrentLevelId] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [levelStats, setLevelStats] = useState({ gems: 0, lives: 3 })
  const [isHydrated, setIsHydrated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on hydration
  useEffect(() => {
    setIsHydrated(true)
    setIsMobile(window.innerWidth < 768)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load progress from localStorage and Firebase after hydration
  useEffect(() => {
    if (!isHydrated) return

    const saved = localStorage.getItem('treasureGameProgress')
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        setUserId(progress.userId)
        setUsername(progress.username)
        setCurrentLevelId(progress.levelId || 1)
        setSoundEnabled(progress.soundEnabled !== false)
        setGameState('menu')
      } catch (e) {
        console.error('Error loading progress:', e)
        setGameState('setup')
      }
    }
  }, [isHydrated])

  // Save progress to localStorage when user changes
  useEffect(() => {
    if (!isHydrated || !userId) return
    localStorage.setItem(
      'treasureGameProgress',
      JSON.stringify({
        userId,
        username,
        levelId: currentLevelId,
        soundEnabled,
        timestamp: Date.now(),
      })
    )
  }, [isHydrated, userId, username, currentLevelId, soundEnabled])

  const handleUsernameSet = (newUserId: string, newUsername: string) => {
    setUserId(newUserId)
    setUsername(newUsername)
    setGameState('menu')
  }

  const handleStartGame = (levelId: number) => {
    const level = getLevelById(levelId)
    if (level) {
      setCurrentLevelId(levelId)
      setCurrentLevel(level)
      setLevelStats({ gems: 0, lives: 3 })
      setGameState('playing')
    }
  }

  const handleLevelComplete = (gemsCollected: number) => {
    setLevelStats({ gems: gemsCollected, lives: 3 })
    
    // Save stats to Firebase
    if (userId) {
      updateLevelStats(userId, currentLevelId, gemsCollected, true)
    }
    
    setGameState('levelComplete')
  }

  const handleGameOver = (gemsCollected: number) => {
    setLevelStats({ gems: gemsCollected, lives: 0 })
    
    // Save attempt stats to Firebase
    if (userId) {
      updateLevelStats(userId, currentLevelId, gemsCollected, false)
    }
    
    setGameState('gameOver')
  }

  const handleNextLevel = () => {
    const nextLevel = getNextLevel(currentLevelId)
    if (nextLevel) {
      handleStartGame(nextLevel.id)
    } else {
      // Game complete
      setGameState('menu')
    }
  }

  const handleRetry = () => {
    handleStartGame(currentLevelId)
  }

  const handleReturnToMenu = () => {
    setGameState('menu')
    setCurrentLevel(null)
  }

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  // Don't render until hydrated to prevent mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-900 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {gameState === 'setup' && (
        <UsernameSetup onUsernameSet={handleUsernameSet} />
      )}

      {gameState === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          username={username}
          userId={userId}
        />
      )}

      {gameState === 'playing' && currentLevel && (
        <div className="h-screen bg-gradient-to-b from-blue-400 to-green-200 flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden">
          <div className="w-full px-2 sm:px-4 py-2 sm:py-3 flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">
              <div className="text-center sm:text-left min-w-0">
                <p className="text-xs sm:text-sm text-white drop-shadow-lg">Player: {username}</p>
                <h2 className="text-base sm:text-2xl font-bold text-white drop-shadow-lg truncate">
                  {currentLevel.name}
                </h2>
              </div>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={handleToggleSound}
                  className="bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all"
                  title="Toggle Sound"
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
                <button
                  onClick={handleReturnToMenu}
                  className="bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-base shadow-md transition-all whitespace-nowrap"
                >
                  Menu
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col items-center justify-center px-2 sm:px-4 py-2 min-w-0 overflow-hidden">
            <GameCanvas
              level={currentLevel}
              onLevelComplete={handleLevelComplete}
              onGameOver={handleGameOver}
              isMobile={isMobile}
            />

            <p className="text-white text-center mt-2 sm:mt-3 text-xs sm:text-sm drop-shadow-lg flex-shrink-0">
              {isMobile
                ? 'Use buttons to move and jump'
                : 'Arrow Keys to move, Space to jump'}
            </p>
          </div>

          <div className="h-28 sm:h-0 flex-shrink-0" />
        </div>
      )}

      {gameState === 'levelComplete' && (
        <LevelComplete
          currentLevelId={currentLevelId}
          gems={levelStats.gems}
          lives={levelStats.lives}
          onNextLevel={handleNextLevel}
          onMenu={handleReturnToMenu}
          username={username}
        />
      )}

      {gameState === 'gameOver' && (
        <GameOver
          currentLevelId={currentLevelId}
          gems={levelStats.gems}
          onRetry={handleRetry}
          onMenu={handleReturnToMenu}
          username={username}
        />
      )}
    </>
  )
}
