'use client'

import { useEffect, useRef, useState } from 'react'

interface Obstacle {
  id: number
  x: number
  width: number
}

export function PixelRunnerGame({ onSessionData }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [distance, setDistance] = useState(0)
  const gameRef = useRef<any>(null)

  const gameStateRef = useRef({
    playerY: 450,
    playerVelocity: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    score: 0,
    distance: 0,
    gameSpeed: 6,
    gameOver: false
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 400
    canvas.height = 600
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'ArrowUp') && !gameStateRef.current.isJumping && !gameStateRef.current.gameOver) {
        e.preventDefault()
        gameStateRef.current.playerVelocity = -12
        gameStateRef.current.isJumping = true
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    let obstacleId = 0
    const spawnObstacle = () => {
      if (!gameStateRef.current.gameOver) {
        gameStateRef.current.obstacles.push({
          id: obstacleId++,
          x: 400,
          width: 30
        })
      }
    }

    const gameLoop = setInterval(() => {
      if (gameStateRef.current.gameOver) return

      gameStateRef.current.playerVelocity += 0.6
      gameStateRef.current.playerY += gameStateRef.current.playerVelocity

      if (gameStateRef.current.playerY > 450) {
        gameStateRef.current.playerY = 450
        gameStateRef.current.playerVelocity = 0
        gameStateRef.current.isJumping = false
      }

      gameStateRef.current.obstacles.forEach((obstacle, idx) => {
        obstacle.x -= gameStateRef.current.gameSpeed

        if (
          obstacle.x < 50 + 30 &&
          obstacle.x + obstacle.width > 50 &&
          gameStateRef.current.playerY + 30 > 450
        ) {
          gameStateRef.current.gameOver = true
          setGameOver(true)
        }

        if (obstacle.x < -30) {
          gameStateRef.current.obstacles.splice(idx, 1)
          gameStateRef.current.score += 10
          gameStateRef.current.gameSpeed += 0.1
          setScore(gameStateRef.current.score)
        }
      })

      gameStateRef.current.distance += 1
      setDistance(Math.floor(gameStateRef.current.distance / 10))

      if (gameStateRef.current.distance % 60 === 0) {
        spawnObstacle()
      }

      ctx.fillStyle = '#87CEEB'
      ctx.fillRect(0, 0, 400, 300)

      ctx.fillStyle = '#228B22'
      ctx.fillRect(0, 300, 400, 300)

      ctx.fillStyle = '#FF1493'
      ctx.fillRect(50, gameStateRef.current.playerY, 30, 30)

      gameStateRef.current.obstacles.forEach(obstacle => {
        ctx.fillStyle = '#000000'
        ctx.fillRect(obstacle.x, 450, obstacle.width, 50)
      })

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 16px Arial'
      ctx.fillText(`Score: ${gameStateRef.current.score}`, 10, 30)
      ctx.fillText(`Distance: ${Math.floor(gameStateRef.current.distance / 10)}m`, 10, 55)
      ctx.fillText(`Speed: ${(gameStateRef.current.gameSpeed * 10).toFixed(1)}`, 310, 30)
    }, 30)

    return () => {
      clearInterval(gameLoop)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (gameRef.current && gameOver) {
      gameRef.current.gameEngineRef = {
        current: {
          player: { gems: Math.floor(score / 5) }
        }
      }
      gameRef.current.currentLevelId = 1
      gameRef.current.levelComplete = true

      onSessionData?.({
        levelReached: 1,
        gemsCollected: Math.floor(score / 5),
        score: score,
        completed: gameOver
      })
    }
  }, [gameOver, score, onSessionData])

  const resetGame = () => {
    gameStateRef.current = {
      playerY: 450,
      playerVelocity: 0,
      isJumping: false,
      obstacles: [],
      score: 0,
      distance: 0,
      gameSpeed: 6,
      gameOver: false
    }
    setScore(0)
    setDistance(0)
    setGameOver(false)
  }

  return (
    <div
      ref={gameRef}
      className="w-full h-screen bg-gradient-to-b from-green-400 to-green-600 flex flex-col items-center justify-center p-4"
    >
      <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Pixel Runner</h1>

      <div className="border-4 border-white rounded-lg overflow-hidden mb-4 drop-shadow-lg">
        <canvas ref={canvasRef} />
      </div>

      <div className="text-white text-center">
        <p className="text-lg mb-2 font-bold">Press Space or Up Arrow to jump</p>

        {gameOver && (
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-8 mt-4 max-w-md">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Game Over!</h2>
            <p className="text-xl mb-2">
              Score: <span className="text-cyan-400 font-bold">{score}</span>
            </p>
            <p className="text-xl mb-6">
              Distance: <span className="text-cyan-400 font-bold">{distance}m</span>
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
