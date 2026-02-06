'use client'

import { useEffect, useRef, useState } from 'react'

interface Enemy {
  id: number
  x: number
  y: number
  width: number
  height: number
}

interface Bullet {
  id: number
  x: number
  y: number
}

export function SpaceBlasterGame({ onSessionData }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [wave, setWave] = useState(1)
  const gameRef = useRef<any>(null)

  const gameStateRef = useRef({
    playerX: 175,
    playerY: 550,
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    score: 0,
    lives: 3,
    wave: 1,
    gameOver: false
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Responsive canvas sizing
    const containerWidth = Math.min(window.innerWidth - 32, 400)
    const aspectRatio = 600 / 400
    const containerHeight = containerWidth * aspectRatio

    canvas.width = containerWidth
    canvas.height = containerHeight
    
    // Scale game state based on canvas size
    gameStateRef.current.playerX = (containerWidth / 400) * 175
    gameStateRef.current.playerY = (containerHeight / 600) * 550

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && gameStateRef.current.playerX > 0) {
        gameStateRef.current.playerX -= 10
      } else if (e.key === 'ArrowRight' && gameStateRef.current.playerX < 350) {
        gameStateRef.current.playerX += 10
      } else if (e.key === ' ') {
        e.preventDefault()
        gameStateRef.current.bullets.push({
          id: Date.now(),
          x: gameStateRef.current.playerX + 15,
          y: gameStateRef.current.playerY
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    const spawnEnemy = () => {
      if (!gameStateRef.current.gameOver && gameStateRef.current.enemies.length < 3 + gameStateRef.current.wave) {
        gameStateRef.current.enemies.push({
          id: Date.now(),
          x: Math.random() * 350,
          y: -30,
          width: 30,
          height: 30
        })
      }
    }

    const gameLoop = setInterval(() => {
      if (gameStateRef.current.gameOver) return

      spawnEnemy()

      gameStateRef.current.bullets.forEach((bullet, idx) => {
        bullet.y -= 5

        gameStateRef.current.enemies.forEach((enemy, eidx) => {
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + 4 > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + 10 > enemy.y
          ) {
            gameStateRef.current.score += 10
            gameStateRef.current.bullets.splice(idx, 1)
            gameStateRef.current.enemies.splice(eidx, 1)
            setScore(gameStateRef.current.score)
          }
        })

        if (bullet.y < 0) {
          gameStateRef.current.bullets.splice(idx, 1)
        }
      })

      gameStateRef.current.enemies.forEach((enemy, idx) => {
        enemy.y += 3

        if (enemy.y > 600) {
          gameStateRef.current.lives--
          gameStateRef.current.enemies.splice(idx, 1)
          setLives(gameStateRef.current.lives)

          if (gameStateRef.current.lives === 0) {
            gameStateRef.current.gameOver = true
            setGameOver(true)
          }
        }
      })

      if (gameStateRef.current.score > 0 && gameStateRef.current.score % 100 === 0 && gameStateRef.current.enemies.length === 0) {
        gameStateRef.current.wave++
        setWave(gameStateRef.current.wave)
      }

      ctx.fillStyle = '#000814'
      ctx.fillRect(0, 0, 400, 600)

      gameStateRef.current.enemies.forEach(enemy => {
        ctx.fillStyle = '#FF006E'
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
      })

      gameStateRef.current.bullets.forEach(bullet => {
        ctx.fillStyle = '#00D9FF'
        ctx.fillRect(bullet.x, bullet.y, 4, 10)
      })

      ctx.fillStyle = '#00D9FF'
      ctx.fillRect(gameStateRef.current.playerX, gameStateRef.current.playerY, 30, 30)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = '14px Arial'
      ctx.fillText(`Score: ${gameStateRef.current.score}`, 10, 20)
      ctx.fillText(`Lives: ${gameStateRef.current.lives}`, 10, 40)
      ctx.fillText(`Wave: ${gameStateRef.current.wave}`, 320, 20)
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
          player: { gems: Math.floor(score / 10) }
        }
      }
      gameRef.current.currentLevelId = wave
      gameRef.current.levelComplete = true

      onSessionData?.({
        levelReached: wave,
        gemsCollected: Math.floor(score / 10),
        score: score,
        completed: gameOver
      })
    }
  }, [gameOver, score, wave, onSessionData])

  const resetGame = () => {
    gameStateRef.current = {
      playerX: 175,
      playerY: 550,
      bullets: [],
      enemies: [],
      score: 0,
      lives: 3,
      wave: 1,
      gameOver: false
    }
    setScore(0)
    setLives(3)
    setWave(1)
    setGameOver(false)
  }

  return (
    <div
      ref={gameRef}
      className="w-full h-screen bg-gradient-to-b from-slate-900 to-black flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-3 sm:mb-4">Space Blaster</h1>

      <div className="w-full max-w-full sm:max-w-md border-2 border-cyan-400 rounded-lg overflow-hidden mb-3 sm:mb-4 flex-shrink-0">
        <canvas ref={canvasRef} className="bg-black w-full h-auto display-block" />
      </div>

      <div className="text-white text-center text-xs sm:text-base flex-shrink-0">
        <p className="mb-2">Arrow Keys to move • Space to shoot</p>

        {gameOver && (
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 sm:p-8 mt-2 sm:mt-4 max-w-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-3 sm:mb-4">Game Over!</h2>
            <p className="text-lg sm:text-xl mb-1 sm:mb-2">
              Final Score: <span className="text-cyan-400 font-bold">{score}</span>
            </p>
            <p className="text-lg sm:text-xl mb-4 sm:mb-6">
              Waves Survived: <span className="text-yellow-400 font-bold">{wave}</span>
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all text-sm sm:text-base"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
