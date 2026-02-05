/**
 * Game Canvas Component
 * Renders the canvas element and manages the game loop
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { GameEngine, type Level } from '@/lib/gameEngine'
import { GameControls } from './GameControls'

interface GameCanvasProps {
  level: Level
  onLevelComplete: (gems: number) => void
  onGameOver: (gems: number) => void
  isMobile: boolean
}

export function GameCanvas({ level, onLevelComplete, onGameOver, isMobile }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const [showControls, setShowControls] = useState(true)
  const [showTouchHint, setShowTouchHint] = useState(isMobile)

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
        const gemsCollected = engine.gemsCollected || 0
        onLevelComplete(gemsCollected)
      } else if (engine.gameOver) {
        const gemsCollected = engine.gemsCollected || 0
        onGameOver(gemsCollected)
      }

      animationIdRef.current = requestAnimationFrame(gameLoop)
    }

    animationIdRef.current = requestAnimationFrame(gameLoop)

    // Hide controls after 3 seconds
    const controlsTimer = setTimeout(() => {
      setShowControls(false)
      setShowTouchHint(false)
    }, 3000)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      clearTimeout(controlsTimer)
    }
  }, [level, onLevelComplete, onGameOver])

  return (
    <>
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
                  {isMobile ? (
                    <>
                      <p>👆 Swipe or tap buttons to move</p>
                      <p>⬆️ Tap jump button</p>
                      <p>Collect gems and reach the exit!</p>
                    </>
                  ) : (
                    <>
                      <p>← → Arrow Keys: Move</p>
                      <p>Space: Jump</p>
                      <p>Collect gems and reach the exit!</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isMobile && <GameControls engineRef={engineRef} isMobile={isMobile} />}
    </>
  )
}
