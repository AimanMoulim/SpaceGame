/**
 * Game Engine Core
 * Handles game state, physics, collisions, and updates
 */

export interface Vector2 {
  x: number
  y: number
}

export interface GameObject {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  type: string
}

export interface Player extends GameObject {
  lives: number
  gems: number
  isJumping: boolean
  isFacingRight: boolean
  checkpointX: number
  checkpointY: number
}

export interface Gem extends GameObject {
  collected: boolean
}

export interface Obstacle extends GameObject {
  active: boolean
}

export interface Level {
  id: number
  name: string
  width: number
  height: number
  platforms: Array<{ x: number; y: number }>
  gems: Array<{ x: number; y: number }>
  spikes: Array<{ x: number; y: number }>
  lava: Array<{ x: number; y: number }>
  checkpoint: { x: number; y: number }
  exit: { x: number; y: number }
}

const GRAVITY = 0.6
const JUMP_POWER = 12
const MOVE_SPEED = 5
const GROUND_FRICTION = 0.9
const AIR_FRICTION = 0.98

export class GameEngine {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  player: Player
  level: Level
  platforms: Obstacle[]
  gems: Gem[]
  spikes: Obstacle[]
  lava: Obstacle[]
  keys: { [key: string]: boolean }
  gameRunning: boolean
  levelComplete: boolean
  gameOver: boolean
  cameraX: number

  constructor(canvas: HTMLCanvasElement, level: Level) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.level = level
    this.gameRunning = true
    this.levelComplete = false
    this.gameOver = false
    this.keys = {}
    this.cameraX = 0

    // Initialize player
    this.player = {
      x: 50,
      y: 300,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      lives: 3,
      gems: 0,
      isJumping: false,
      isFacingRight: true,
      type: 'player',
      checkpointX: 50,
      checkpointY: 300,
    }

    // Initialize platforms
    this.platforms = level.platforms.map((p) => ({
      x: p.x,
      y: p.y,
      width: 64,
      height: 16,
      velocityX: 0,
      velocityY: 0,
      active: true,
      type: 'platform',
    }))

    // Initialize gems
    this.gems = level.gems.map((g) => ({
      x: g.x,
      y: g.y,
      width: 16,
      height: 16,
      velocityX: 0,
      velocityY: 0,
      collected: false,
      type: 'gem',
    }))

    // Initialize spikes
    this.spikes = level.spikes.map((s) => ({
      x: s.x,
      y: s.y,
      width: 32,
      height: 24,
      velocityX: 0,
      velocityY: 0,
      active: true,
      type: 'spike',
    }))

    // Initialize lava
    this.lava = level.lava.map((l) => ({
      x: l.x,
      y: l.y,
      width: 64,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      active: true,
      type: 'lava',
    }))

    this.setupKeyListeners()
  }

  private setupKeyListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true
    })

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false
    })
  }

  update() {
    if (!this.gameRunning) return

    // Handle player input
    if (this.keys['arrowleft']) {
      this.player.velocityX = -MOVE_SPEED
      this.player.isFacingRight = false
    } else if (this.keys['arrowright']) {
      this.player.velocityX = MOVE_SPEED
      this.player.isFacingRight = true
    } else {
      this.player.velocityX *= GROUND_FRICTION
    }

    // Jump
    if (this.keys[' '] && !this.player.isJumping) {
      this.player.velocityY = -JUMP_POWER
      this.player.isJumping = true
    }

    // Apply gravity
    this.player.velocityY += GRAVITY
    if (this.player.velocityY > 20) this.player.velocityY = 20 // Terminal velocity

    // Update player position
    this.player.x += this.player.velocityX
    this.player.y += this.player.velocityY

    // Check collisions
    this.checkPlatformCollisions()
    this.checkGemCollisions()
    this.checkHazardCollisions()
    this.checkExitCollision()

    // Camera follow
    this.cameraX = this.player.x - 100

    // Bounds checking
    if (this.player.y > this.canvas.height) {
      this.respawnPlayer()
    }
  }

  private checkPlatformCollisions() {
    let onGround = false

    for (const platform of this.platforms) {
      // Simple AABB collision
      if (
        this.player.x < platform.x + platform.width &&
        this.player.x + this.player.width > platform.x &&
        this.player.y + this.player.height >= platform.y &&
        this.player.y + this.player.height <= platform.y + platform.height + 10 &&
        this.player.velocityY >= 0
      ) {
        this.player.y = platform.y - this.player.height
        this.player.velocityY = 0
        this.player.isJumping = false
        onGround = true
      }
    }
  }

  private checkGemCollisions() {
    for (const gem of this.gems) {
      if (!gem.collected) {
        if (
          this.player.x < gem.x + gem.width &&
          this.player.x + this.player.width > gem.x &&
          this.player.y < gem.y + gem.height &&
          this.player.y + this.player.height > gem.y
        ) {
          gem.collected = true
          this.player.gems++
          this.playSound('collect')
        }
      }
    }
  }

  private checkHazardCollisions() {
    // Check spikes
    for (const spike of this.spikes) {
      if (
        this.player.x < spike.x + spike.width &&
        this.player.x + this.player.width > spike.x &&
        this.player.y < spike.y + spike.height &&
        this.player.y + this.player.height > spike.y
      ) {
        this.loseLife()
        return
      }
    }

    // Check lava
    for (const lava of this.lava) {
      if (
        this.player.x < lava.x + lava.width &&
        this.player.x + this.player.width > lava.x &&
        this.player.y < lava.y + lava.height &&
        this.player.y + this.player.height > lava.y
      ) {
        this.loseLife()
        return
      }
    }
  }

  private checkExitCollision() {
    const exit = this.level.exit
    if (
      this.player.x < exit.x + 32 &&
      this.player.x + this.player.width > exit.x &&
      this.player.y < exit.y + 32 &&
      this.player.y + this.player.height > exit.y
    ) {
      this.levelComplete = true
      this.gameRunning = false
      this.playSound('complete')
    }
  }

  private loseLife() {
    this.player.lives--
    if (this.player.lives <= 0) {
      this.gameOver = true
      this.gameRunning = false
    } else {
      this.respawnPlayer()
    }
    this.playSound('hurt')
  }

  private respawnPlayer() {
    this.player.x = this.player.checkpointX
    this.player.y = this.player.checkpointY
    this.player.velocityX = 0
    this.player.velocityY = 0
  }

  private playSound(type: string) {
    // Sound implementation would go here
    // For now, just logging
    console.log('[Game] Sound:', type)
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = '#87CEEB' // Sky blue
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw level background
    this.ctx.fillStyle = '#E0C084' // Sand
    this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100)

    // Draw with camera offset
    this.ctx.save()
    this.ctx.translate(-this.cameraX, 0)

    // Draw platforms
    this.ctx.fillStyle = '#8B6F47' // Brown
    for (const platform of this.platforms) {
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
      this.ctx.strokeStyle = '#5C4629'
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
    }

    // Draw spikes
    this.ctx.fillStyle = '#FF6B6B' // Red
    for (const spike of this.spikes) {
      this.drawSpike(spike.x, spike.y, spike.width, spike.height)
    }

    // Draw lava
    this.ctx.fillStyle = '#FF8C00' // Orange
    for (const lava of this.lava) {
      this.ctx.fillRect(lava.x, lava.y, lava.width, lava.height)
      this.ctx.strokeStyle = '#FF4500'
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(lava.x, lava.y, lava.width, lava.height)
    }

    // Draw gems
    this.ctx.fillStyle = '#00CED1' // Cyan
    for (const gem of this.gems) {
      if (!gem.collected) {
        this.ctx.beginPath()
        this.ctx.arc(gem.x + 8, gem.y + 8, 8, 0, Math.PI * 2)
        this.ctx.fill()
        this.ctx.strokeStyle = '#00BFFF'
        this.ctx.lineWidth = 2
        this.ctx.stroke()
      }
    }

    // Draw exit
    this.ctx.fillStyle = '#FFD700' // Gold
    const exit = this.level.exit
    this.ctx.fillRect(exit.x, exit.y, 32, 32)
    this.ctx.fillStyle = '#FFA500'
    this.ctx.font = 'bold 16px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('EXIT', exit.x + 16, exit.y + 20)

    // Draw player
    this.ctx.fillStyle = this.player.isJumping ? '#FF69B4' : '#FF8C42' // Pink when jumping, orange otherwise
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height)
    this.ctx.strokeStyle = '#FF6B35'
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height)

    // Draw eyes
    this.ctx.fillStyle = '#000000'
    const eyeY = this.player.y + 10
    const eyeSize = 4
    if (this.player.isFacingRight) {
      this.ctx.fillRect(this.player.x + 18, eyeY, eyeSize, eyeSize)
      this.ctx.fillRect(this.player.x + 28, eyeY, eyeSize, eyeSize)
    } else {
      this.ctx.fillRect(this.player.x + 10, eyeY, eyeSize, eyeSize)
      this.ctx.fillRect(this.player.x + 20, eyeY, eyeSize, eyeSize)
    }

    this.ctx.restore()

    // Draw HUD
    this.drawHUD()
  }

  private drawSpike(x: number, y: number, w: number, h: number) {
    // Draw a simple spike shape
    this.ctx.beginPath()
    this.ctx.moveTo(x, y + h)
    this.ctx.lineTo(x + w / 2, y)
    this.ctx.lineTo(x + w, y + h)
    this.ctx.closePath()
    this.ctx.fill()
  }

  private drawHUD() {
    const padding = 10
    const lineHeight = 30

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, 0, 300, lineHeight * 3 + padding * 2)

    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.font = 'bold 20px Arial'
    this.ctx.textAlign = 'left'

    let y = padding + 25
    this.ctx.fillText(`Level: ${this.level.name}`, padding, y)
    y += lineHeight
    this.ctx.fillText(`Lives: ${'❤️'.repeat(this.player.lives)}`, padding, y)
    y += lineHeight
    this.ctx.fillText(`Gems: ${this.player.gems}`, padding, y)

    // Draw status
    if (this.levelComplete) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      this.ctx.fillRect(0, this.canvas.height / 2 - 50, this.canvas.width, 100)
      this.ctx.fillStyle = '#FFD700'
      this.ctx.font = 'bold 40px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, this.canvas.height / 2 + 10)
    }

    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      this.ctx.fillRect(0, this.canvas.height / 2 - 50, this.canvas.width, 100)
      this.ctx.fillStyle = '#FF6B6B'
      this.ctx.font = 'bold 40px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 + 10)
    }
  }

  setCheckpoint(x: number, y: number) {
    this.player.checkpointX = x
    this.player.checkpointY = y
  }

  reset() {
    this.player.lives = 3
    this.player.gems = 0
    this.gameRunning = true
    this.levelComplete = false
    this.gameOver = false
    this.respawnPlayer()
    this.gems.forEach((g) => (g.collected = false))
  }
}
