/**
 * Game Over Component
 * Displays when player loses all lives
 */

'use client'

import { Button } from '@/components/ui/button'

interface GameOverProps {
  currentLevelId: number
  gems: number
  onRetry: () => void
  onMenu: () => void
}

export function GameOver({ currentLevelId, gems, onRetry, onMenu }: GameOverProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-200 to-orange-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Icon */}
        <div className="text-7xl">😢</div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-red-900">Game Over!</h1>

        {/* Stats */}
        <div className="bg-white/90 rounded-lg p-8 shadow-lg space-y-4">
          <div className="text-2xl text-red-900">
            <p className="font-bold mb-4">You ran out of lives!</p>

            <div className="space-y-3 text-lg">
              <p>📍 Level: {currentLevelId}</p>
              <p>💎 Gems Collected: {gems}</p>
              <p className="text-amber-700 mt-4">
                Don't give up! Every explorer learns from their adventures.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 flex flex-col">
          <Button
            onClick={onRetry}
            className="text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            🔄 Try Again
          </Button>

          <Button
            onClick={onMenu}
            className="text-lg py-6 bg-purple-600 hover:bg-purple-700 text-white"
            variant="default"
            size="lg"
          >
            🏠 Return to Menu
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-2">
          <p className="font-bold text-blue-900">💡 Tips for Next Time:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Use your three hearts wisely</li>
            <li>✓ Look for checkpoints (marked areas)</li>
            <li>✓ Collect gems for bonus points</li>
            <li>✓ Time your jumps carefully</li>
            <li>✓ Avoid spikes and lava!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
