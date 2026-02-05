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
import { getLevelById, getNextLevel } from '@/lib/levels'
import type { Level } from '@/lib/gameEngine'

type GameState = 'menu' | 'playing' | 'levelComplete' | 'gameOver'

export function GameScreen() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null)
  const [currentLevelId, setCurrentLevelId] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [levelStats, setLevelStats] = useState({ gems: 0, lives: 3 })

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('treasureGameProgress')
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        setCurrentLevelId(progress.levelId || 1)
        setSoundEnabled(progress.soundEnabled !== false)
      } catch (e) {
        console.error('Error loading progress:', e)
      }
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(
      'treasureGameProgress',
      JSON.stringify({
        levelId: currentLevelId,
        soundEnabled,
        timestamp: Date.now(),
      })
    )
  }, [currentLevelId, soundEnabled])

  const handleStartGame = (levelId: number) => {
    const level = getLevelById(levelId)
    if (level) {
      setCurrentLevelId(levelId)
      setCurrentLevel(level)
      setLevelStats({ gems: 0, lives: 3 })
      setGameState('playing')
    }
  }

  const handleLevelComplete = () => {
    // Get stats from the game engine (this would be passed from GameCanvas)
    setGameState('levelComplete')
  }

  const handleGameOver = () => {
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

  return (
    <>
      {gameState === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {gameState === 'playing' && currentLevel && (
        <div className="min-h-screen bg-gradient-to-b from-blue-400 to-green-200 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                {currentLevel.name}
              </h2>
              <button
                onClick={handleReturnToMenu}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold"
              >
                ✕ Menu
              </button>
            </div>

            <GameCanvas
              level={currentLevel}
              onLevelComplete={() => {
                // Simulate getting stats - in a real game, this would come from the engine
                setLevelStats({ gems: 5, lives: 2 })
                handleLevelComplete()
              }}
              onGameOver={handleGameOver}
            />

            <p className="text-white text-center mt-4 text-sm drop-shadow-lg">
              Use Arrow Keys to move, Space to jump. Collect gems and reach the exit!
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
        />
      )}

      {gameState === 'gameOver' && (
        <GameOver
          currentLevelId={currentLevelId}
          gems={levelStats.gems}
          onRetry={handleRetry}
          onMenu={handleReturnToMenu}
        />
      )}
    </>
  )
}
