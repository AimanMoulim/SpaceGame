/**
 * Game Screen for Mobile - Touch-optimized version with button controls
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { GameCanvasMobile } from './GameCanvasMobile'
import { MainMenu } from './MainMenu'
import { LevelComplete } from './LevelComplete'
import { GameOver } from './GameOver'
import { UsernameSetup } from './UsernameSetup'
import { getLevelById, getNextLevel } from '@/lib/levels'
import { updateLevelStats } from '@/lib/firebaseService'
import type { Level } from '@/lib/gameEngine'

type GameState = 'setup' | 'menu' | 'playing' | 'levelComplete' | 'gameOver'

export function GameScreenMobile() {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null)
  const [currentLevelId, setCurrentLevelId] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [levelStats, setLevelStats] = useState({ gems: 0, lives: 3 })
  const [isHydrated, setIsHydrated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const gameEngineRef = useRef<any>(null)

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
      <div className="h-screen w-screen bg-gradient-to-b from-blue-300 via-blue-200 to-green-100 flex items-center justify-center">
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
        <div className="w-screen h-screen bg-gradient-to-b from-blue-400 to-green-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 px-3 py-2 flex justify-between items-center gap-2 bg-black/10">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white drop-shadow-lg">Player: {username}</p>
              <h2 className="text-base font-bold text-white drop-shadow-lg truncate">
                {currentLevel.name}
              </h2>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={handleToggleSound}
                className="bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-2 py-1 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"
                title="Toggle Sound"
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
              <button
                onClick={handleReturnToMenu}
                className="bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 py-1 rounded-lg font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Menu
              </button>
            </div>
          </div>

          {/* Game Area */}
          <div className="flex-1 flex items-center justify-center overflow-hidden px-1 py-1">
            <GameCanvasMobile
              level={currentLevel}
              onLevelComplete={handleLevelComplete}
              onGameOver={handleGameOver}
              engineRef={gameEngineRef}
            />
          </div>

          {/* Mobile Controls */}
          <div className="flex-shrink-0 h-24 bg-black/5 border-t border-black/10 flex items-center justify-center gap-3 px-2 py-2">
            <button
              onMouseDown={() => gameEngineRef.current?.moveLeft()}
              onMouseUp={() => gameEngineRef.current?.stopMove()}
              onTouchStart={() => gameEngineRef.current?.moveLeft()}
              onTouchEnd={() => gameEngineRef.current?.stopMove()}
              className="w-16 h-16 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white text-2xl font-bold rounded-lg shadow-lg transition-all active:scale-95"
            >
              ◀
            </button>
            <button
              onMouseDown={() => gameEngineRef.current?.jump()}
              onTouchStart={() => gameEngineRef.current?.jump()}
              className="w-16 h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:from-emerald-700 active:to-emerald-800 text-white text-2xl font-bold rounded-lg shadow-lg transition-all active:scale-95"
            >
              ⬆
            </button>
            <button
              onMouseDown={() => gameEngineRef.current?.moveRight()}
              onMouseUp={() => gameEngineRef.current?.stopMove()}
              onTouchStart={() => gameEngineRef.current?.moveRight()}
              onTouchEnd={() => gameEngineRef.current?.stopMove()}
              className="w-16 h-16 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white text-2xl font-bold rounded-lg shadow-lg transition-all active:scale-95"
            >
              ▶
            </button>
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
