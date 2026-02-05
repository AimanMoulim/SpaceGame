/**
 * Game Screen for PC - Desktop version with keyboard controls
 */

'use client'

import { useState, useEffect } from 'react'
import { GameCanvas } from './GameCanvas'
import { MainMenu } from './MainMenu'
import { LevelComplete } from './LevelComplete'
import { GameOver } from './GameOver'
import { UsernameSetup } from './UsernameSetup'
import { getLevelById, getNextLevel } from '@/lib/levels'
import { updateLevelStats } from '@/lib/firebaseService'
import type { Level } from '@/lib/gameEngine'

type GameState = 'setup' | 'menu' | 'playing' | 'levelComplete' | 'gameOver'

export function GameScreenPC() {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null)
  const [currentLevelId, setCurrentLevelId] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [levelStats, setLevelStats] = useState({ gems: 0, lives: 3 })
  const [isHydrated, setIsHydrated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

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
    if (userId) {
      updateLevelStats(userId, currentLevelId, gemsCollected, true)
    }
    setGameState('levelComplete')
  }

  const handleGameOver = (gemsCollected: number) => {
    setLevelStats({ gems: gemsCollected, lives: 0 })
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

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-200 to-green-100 flex items-center justify-center">
        <p className="text-slate-900 text-lg font-semibold">Loading...</p>
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
        <div className="min-h-screen bg-gradient-to-b from-blue-400 to-green-200 flex flex-col items-center justify-center p-4 overflow-x-hidden">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4 gap-3">
              <div className="text-left">
                <p className="text-sm text-white drop-shadow-lg">Player: {username}</p>
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                  {currentLevel.name}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleToggleSound}
                  className="bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-2 rounded-lg font-bold shadow-md transition-all"
                  title="Toggle Sound"
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
                <button
                  onClick={handleReturnToMenu}
                  className="bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"
                >
                  Menu
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <GameCanvas
                level={currentLevel}
                onLevelComplete={handleLevelComplete}
                onGameOver={handleGameOver}
                isMobile={false}
              />
            </div>

            <p className="text-white text-center mt-4 text-sm drop-shadow-lg">
              Arrow Keys to move, Space to jump. Collect gems and reach the exit!
            </p>
          </div>
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
