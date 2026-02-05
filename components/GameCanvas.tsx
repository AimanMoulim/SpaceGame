/**
 * Game Canvas Component
 * Renders the canvas element and manages the game loop
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { GameEngine, type Level } from '@/lib/gameEngine'

interface GameCanvasProps {
  level: Level
  onLevelComplete: () => void
  onGameOver: () => void
}

export function GameCanvas({ level, onLevelComplete, onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Initialize engine
    const engine = new GameEngine(canvas, level)
    engineRef.current = engine

    // Game loop
    const gameLoop = () => {
      engine.update()
      engine.render()

      if (engine.levelComplete) {
        onLevelComplete()
      } else if (engine.gameOver) {
        onGameOver()
      }

      animationIdRef.current = requestAnimationFrame(gameLoop)
    }

    animationIdRef.current = requestAnimationFrame(gameLoop)

    // Hide controls after 3 seconds
    const controlsTimer = setTimeout(() => {
      setShowControls(false)
    }, 3000)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      clearTimeout(controlsTimer)
    }
  }, [level, onLevelComplete, onGameOver])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-gray-800 rounded-lg shadow-lg bg-sky-300"
        />
        {showControls && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
            <div className="bg-white p-8 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-4">Controls</h3>
              <div className="space-y-2 text-sm">
                <p>← → Arrow Keys: Move</p>
                <p>Space: Jump</p>
                <p>Collect gems and reach the exit!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
