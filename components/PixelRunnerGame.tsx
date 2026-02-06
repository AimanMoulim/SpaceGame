'use client'

import { useEffect, useRef, useState } from 'react'

interface GameState {
  playerX: number
  playerY: number
  playerVelY: number
  obstacles: Array<{ x: number; width: number }>
  score: number
  distance: number
  gameRunning: boolean
  gameOver: boolean
}

export function PixelRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameStateRef = useRef<GameState>({
    playerX: 0,
    playerY: 0,
    playerVelY: 0,
    obstacles: [],
    score: 0,
    distance: 0,
    gameRunning: true,
    gameOver: false
  })
  const [score, setScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const keysPressed = useRef<Record<string, boolean>>({})

  // Mobile controls
  const [showControls, setShowControls] = useState(true)
  const handleJump = () => {
    if (gameStateRef.current.playerY === 0 && gameStateRef.current.gameRunning) {
      gameStateRef.current.playerVelY = -12
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const containerWidth = Math.min(window.innerWidth - 32, 400)
    const containerHeight = (containerWidth / 400) * 600

    canvas.width = containerWidth
    canvas.height = containerHeight

    gameStateRef.current.playerX = containerWidth * 0.15
    gameStateRef.current.playerY = 0

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gameLoop = () => {
      const game = gameStateRef.current
      const gravity = 0.4
      const playerSize = containerHeight * 0.08

      // Update player velocity
      game.playerVelY += gravity
      game.playerY += game.playerVelY

      // Ground collision
      if (game.playerY >= containerHeight - playerSize) {
        game.playerY = containerHeight - playerSize
        game.playerVelY = 0
      }

      // Keyboard controls
      if (keysPressed.current['Space'] || keysPressed.current['ArrowUp']) {
        if (game.playerY === containerHeight - playerSize && game.gameRunning) {
          game.playerVelY = -12
        }
      }

      // Update obstacles
      for (let i = game.obstacles.length - 1; i >= 0; i--) {
        game.obstacles[i].x -= 6
        if (game.obstacles[i].x < -50) {
          game.obstacles.splice(i, 1)
          game.score += 10
          setScore(game.score)
          game.distance = Math.floor(game.score / 10)
          setDistance(game.distance)
        }
      }

      // Generate obstacles
      if (Math.random() < 0.02) {
        game.obstacles.push({
          x: containerWidth,
          width: containerWidth * 0.08
        })
      }

      // Collision detection
      const obstacleHeight = playerSize * 0.8
      for (const obstacle of game.obstacles) {
        if (
          game.playerX < obstacle.x + obstacle.width &&
          game.playerX + playerSize > obstacle.x &&
          game.playerY + playerSize > containerHeight - obstacleHeight
        ) {
          game.gameRunning = false
          game.gameOver = true
          setGameOver(true)
        }
      }

      // Clear and draw
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, containerWidth, containerHeight)

      // Draw ground
      ctx.fillStyle = '#ff00ff'
      ctx.fillRect(0, containerHeight - playerSize - 5, containerWidth, 5)

      // Draw player (cyberpunk style)
      ctx.fillStyle = '#00ff88'
      ctx.fillRect(game.playerX, game.playerY, playerSize, playerSize)
      ctx.strokeStyle = '#00ffff'
      ctx.lineWidth = 2
      ctx.strokeRect(game.playerX - 2, game.playerY - 2, playerSize + 4, playerSize + 4)

      // Draw obstacles
      ctx.fillStyle = '#ff0055'
      for (const obstacle of game.obstacles) {
        ctx.fillRect(obstacle.x, containerHeight - obstacleHeight, obstacle.width, obstacleHeight)
        ctx.strokeStyle = '#ff00ff'
        ctx.lineWidth = 2
        ctx.strokeRect(obstacle.x - 1, containerHeight - obstacleHeight - 1, obstacle.width + 2, obstacleHeight + 2)
      }

      // Draw score
      ctx.fillStyle = '#00ff88'
      ctx.font = `${containerHeight * 0.06}px monospace`
      ctx.fillText(`Score: ${game.score}`, containerWidth * 0.05, containerHeight * 0.1)

      if (game.gameRunning) {
        requestAnimationFrame(gameLoop)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true
      keysPressed.current[e.key.toUpperCase()] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false
      keysPressed.current[e.key.toUpperCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    gameLoop()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const resetGame = () => {
    gameStateRef.current = {
      playerX: gameStateRef.current.playerX,
      playerY: 0,
      playerVelY: 0,
      obstacles: [],
      score: 0,
      distance: 0,
      gameRunning: true,
      gameOver: false
    }
    setScore(0)
    setDistance(0)
    setGameOver(false)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-3 sm:mb-4">
        Pixel Runner
      </h1>

      <div className="w-full max-w-full sm:max-w-md border-2 border-cyan-400 rounded-lg overflow-hidden mb-3 sm:mb-4 drop-shadow-lg flex-shrink-0 bg-black/50">
        <canvas ref={canvasRef} className="w-full h-auto display-block" />
      </div>

      <div className="text-white text-center text-xs sm:text-base flex-shrink-0 mb-3">
        <p className="mb-2 font-bold">Space or Up Arrow / Tap Button to Jump</p>
      </div>

      {/* Mobile Jump Button */}
      <button
        onClick={handleJump}
        disabled={gameOver}
        className="mb-4 px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-lg transition-all active:scale-95 text-base sm:text-lg shadow-lg shadow-cyan-500/50"
      >
        JUMP
      </button>

      {gameOver && (
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 sm:p-8 mt-2 sm:mt-4 max-w-sm w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-3 sm:mb-4">
            Game Over!
          </h2>
          <p className="text-lg sm:text-xl mb-1 sm:mb-2">
            Score: <span className="text-cyan-400 font-bold">{score}</span>
          </p>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6">
            Distance: <span className="text-cyan-400 font-bold">{distance}m</span>
          </p>
          <button
            onClick={resetGame}
            className="w-full px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-pink-600 transition-all text-sm sm:text-base"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}
