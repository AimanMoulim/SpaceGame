/**
 * Game Canvas for Mobile - Optimized for touch devices
 */

'use client'

import React from "react"

import { useEffect, useRef } from 'react'
import { GameEngine, type Level } from '@/lib/gameEngine'

interface GameCanvasMobileProps {
  level: Level
  onLevelComplete: (gems: number) => void
  onGameOver: (gems: number) => void
  engineRef: React.MutableRefObject<any>
}

export function GameCanvasMobile({
  level,
  onLevelComplete,
  onGameOver,
  engineRef,
}: GameCanvasMobileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Get safe viewport dimensions for mobile
    const viewportWidth = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth
    )
    const viewportHeight = Math.min(
      window.innerHeight - 120, // Account for header and controls
      window.innerHeight
    )

    // Set canvas dimensions with aspect ratio preservation
    const canvasWidth = Math.max(viewportWidth - 16, 240)
    const canvasHeight = Math.max(viewportHeight - 16, 240)

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Initialize engine
    const engine = new GameEngine(canvas, level)
    engineRef.current = engine

    // Game loop
    const gameLoop = () => {
      engine.update()
      engine.render()

      if (engine.levelComplete) {
        onLevelComplete(engine.gemsCollected || 0)
      } else if (engine.gameOver) {
        onGameOver(engine.gemsCollected || 0)
      }

      animationIdRef.current = requestAnimationFrame(gameLoop)
    }

    animationIdRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [level, onLevelComplete, onGameOver])

  return (
    <div className="flex items-center justify-center w-full h-full max-w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-800 rounded-lg shadow-lg bg-sky-300 max-w-full max-h-full"
        style={{
          imageRendering: 'pixelated',
          imageRendering: 'crisp-edges',
        }}
      />
    </div>
  )
}
