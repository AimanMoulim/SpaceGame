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
  const keysPressed = useRef({
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false
  })

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

    // Precise canvas sizing for both PC and mobile
    const isMobile = window.innerWidth < 768
    let canvasWidth: number
    let canvasHeight: number

    if (isMobile) {
      // Samsung Android phone dimensions (portrait)
      // Standard Android width: 360-412px, height: 640-800px
      const maxMobileWidth = Math.min(window.innerWidth - 16, 360)
      const maxMobileHeight = Math.min(window.innerHeight * 0.55, 540)
      canvasWidth = maxMobileWidth
      canvasHeight = maxMobileHeight
    } else {
      // Desktop dimensions - max 1800x1000
      const maxDesktopWidth = Math.min(window.innerWidth - 48, 800)
      const maxDesktopHeight = Math.min(window.innerHeight - 300, 600)
      canvasWidth = maxDesktopWidth
      canvasHeight = maxDesktopHeight
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight
    
    // Scale game state based on actual canvas size
    const scaleX = canvasWidth / 400
    const scaleY = canvasHeight / 600
    gameStateRef.current.playerX = 175 * scaleX
    gameStateRef.current.playerY = 550 * scaleY

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const playerWidth = 30 * (canvasWidth / 400)
      const maxX = canvasWidth - playerWidth
      
      if (e.key === 'ArrowLeft' && gameStateRef.current.playerX > 0) {
        gameStateRef.current.playerX = Math.max(0, gameStateRef.current.playerX - 10)
      } else if (e.key === 'ArrowRight' && gameStateRef.current.playerX < maxX) {
        gameStateRef.current.playerX = Math.min(maxX, gameStateRef.current.playerX + 10)
      } else if (e.key === ' ') {
        e.preventDefault()
        gameStateRef.current.bullets.push({
          id: Date.now(),
          x: gameStateRef.current.playerX + (15 * (canvasWidth / 400)),
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
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      const scaleX = canvasWidth / 400
      const scaleY = canvasHeight / 600

      gameStateRef.current.enemies.forEach(enemy => {
        ctx.fillStyle = '#FF006E'
        ctx.fillRect(enemy.x * scaleX, enemy.y * scaleY, enemy.width * scaleX, enemy.height * scaleY)
      })

      gameStateRef.current.bullets.forEach(bullet => {
        ctx.fillStyle = '#00D9FF'
        ctx.fillRect(bullet.x * scaleX, bullet.y * scaleY, 4 * scaleX, 10 * scaleY)
      })

      ctx.fillStyle = '#00D9FF'
      ctx.fillRect(gameStateRef.current.playerX, gameStateRef.current.playerY, 30 * scaleX, 30 * scaleY)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = `${14 * scaleX}px Arial`
      ctx.fillText(`Score: ${gameStateRef.current.score}`, 10, 20)
      ctx.fillText(`Lives: ${gameStateRef.current.lives}`, 10, 40)
      ctx.fillText(`Wave: ${gameStateRef.current.wave}`, canvasWidth - 80, 20)
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

  // Mobile controls
  const handleLeftPress = () => {
    keysPressed.current['ArrowLeft'] = true
  }
  const handleLeftRelease = () => {
    keysPressed.current['ArrowLeft'] = false
  }
  const handleRightPress = () => {
    keysPressed.current['ArrowRight'] = true
  }
  const handleRightRelease = () => {
    keysPressed.current['ArrowRight'] = false
  }
  const handleShoot = () => {
    keysPressed.current[' '] = true
    setTimeout(() => {
      keysPressed.current[' '] = false
    }, 100)
  }

  return (
    <div
      ref={gameRef}
      className="w-full h-screen bg-gradient-to-b from-slate-900 to-black flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-3 sm:mb-4">Space Blaster</h1>

      <div className="flex items-center gap-2 mb-2 text-white text-xs sm:text-sm flex-shrink-0">
        <span>Lives: {lives}</span>
        <span>|</span>
        <span>Wave: {wave}</span>
        <span>|</span>
        <span>Score: {score}</span>
      </div>

      <div className="w-full max-w-full sm:max-w-md border-2 border-cyan-400 rounded-lg overflow-hidden mb-3 sm:mb-4 flex-shrink-0">
        <canvas ref={canvasRef} className="bg-black w-full h-auto display-block" />
      </div>

      {/* Mobile Controls */}
      <div className="w-full flex flex-col items-center gap-3 mb-3">
        <div className="text-white text-center text-xs sm:text-base">
          <p className="mb-1">Arrow Keys or Buttons to move • Space to shoot</p>
        </div>

        {/* Control Buttons */}
        <div className="flex items-end gap-3">
          <button
            onPointerDown={handleLeftPress}
            onPointerUp={handleLeftRelease}
            onPointerLeave={handleLeftRelease}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white text-lg sm:text-xl font-bold rounded-lg shadow-lg transition-all active:scale-95"
            style={{ touchAction: 'none' }}
          >
            LEFT
          </button>

          <button
            onClick={handleShoot}
            className="px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 text-white text-lg sm:text-xl font-bold rounded-lg shadow-lg transition-all active:scale-95"
          >
            SHOOT
          </button>

          <button
            onPointerDown={handleRightPress}
            onPointerUp={handleRightRelease}
            onPointerLeave={handleRightRelease}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white text-lg sm:text-xl font-bold rounded-lg shadow-lg transition-all active:scale-95"
            style={{ touchAction: 'none' }}
          >
            RIGHT
          </button>
        </div>
      </div>

      {gameOver && (
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 sm:p-8 mt-2 sm:mt-4 max-w-sm w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-3 sm:mb-4">Game Over!</h2>
          <p className="text-lg sm:text-xl mb-1 sm:mb-2">
            Final Score: <span className="text-cyan-400 font-bold">{score}</span>
          </p>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6">
            Waves Survived: <span className="text-yellow-400 font-bold">{wave}</span>
          </p>
          <button
            onClick={resetGame}
            className="w-full px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all text-sm sm:text-base"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}
