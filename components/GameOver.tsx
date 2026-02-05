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
  username?: string | null
}

export function GameOver({ currentLevelId, gems, onRetry, onMenu, username }: GameOverProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-200 to-orange-100 flex items-center justify-center p-2 sm:p-4 overflow-x-hidden">
      <div className="text-center space-y-4 sm:space-y-8 max-w-2xl w-full">
        {/* Icon */}
        <div className="text-5xl sm:text-7xl">😢</div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-bold text-red-900">Game Over!</h1>

        {/* Stats */}
        <div className="bg-white/90 rounded-lg p-4 sm:p-8 shadow-lg space-y-2 sm:space-y-4">
          <div className="text-red-900">
            <p className="font-bold text-lg sm:text-2xl mb-3 sm:mb-4">{username}, you ran out of lives!</p>

            <div className="space-y-2 sm:space-y-3 text-sm sm:text-lg">
              <p>Level: {currentLevelId}</p>
              <p>Gems Collected: {gems}</p>
              <p className="text-amber-700 mt-2 sm:mt-4 text-xs sm:text-base">
                Don't give up! Every explorer learns from adventures.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 sm:space-y-3 flex flex-col">
          <Button
            onClick={onRetry}
            className="text-sm sm:text-lg py-4 sm:py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            size="lg"
          >
            Try Again
          </Button>

          <Button
            onClick={onMenu}
            className="text-sm sm:text-lg py-4 sm:py-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            variant="default"
            size="lg"
          >
            Return to Menu
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <p className="font-bold text-blue-900">Tips:</p>
          <ul className="text-blue-800 space-y-1">
            <li>Use your three hearts wisely</li>
            <li>Look for checkpoints</li>
            <li>Time your jumps carefully</li>
            <li>Avoid spikes and lava!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
