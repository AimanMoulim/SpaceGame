/**
 * Level Complete Component
 * Displays when player completes a level
 */

'use client'

import { Button } from '@/components/ui/button'
import { isLastLevel } from '@/lib/levels'

interface LevelCompleteProps {
  currentLevelId: number
  gems: number
  lives: number
  onNextLevel: () => void
  onMenu: () => void
  username?: string | null
}

export function LevelComplete({
  currentLevelId,
  gems,
  lives,
  onNextLevel,
  onMenu,
  username,
}: LevelCompleteProps) {
  const isLast = isLastLevel(currentLevelId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-orange-100 flex items-center justify-center p-2 sm:p-4 overflow-x-hidden">
      <div className="text-center space-y-4 sm:space-y-8 max-w-2xl w-full">
        {/* Celebration */}
        <div className="text-5xl sm:text-7xl animate-bounce">🎉</div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-bold text-amber-900">Level Complete!</h1>

        {/* Stats */}
        <div className="bg-white/90 rounded-lg p-4 sm:p-8 shadow-lg space-y-2 sm:space-y-4">
          <div className="text-amber-900">
            <p className="font-bold text-lg sm:text-2xl mb-3 sm:mb-4">Great Job, {username}!</p>

            <div className="space-y-2 sm:space-y-3 text-sm sm:text-lg">
              <p>Gems Collected: {gems}</p>
              <p>Lives Remaining: {lives}/3</p>
              <p>Bonus: {lives > 1 ? '+' + lives * 10 : 'Safe completion!'}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 sm:space-y-3 flex flex-col">
          {!isLast ? (
            <Button
              onClick={onNextLevel}
              className="text-sm sm:text-lg py-4 sm:py-6 bg-green-600 hover:bg-green-700 text-white font-semibold"
              size="lg"
            >
              Next Level
            </Button>
          ) : (
            <Button
              onClick={onNextLevel}
              className="text-sm sm:text-lg py-4 sm:py-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
              size="lg"
            >
              Game Complete!
            </Button>
          )}

          <Button
            onClick={onMenu}
            className="text-sm sm:text-lg py-4 sm:py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            variant="default"
            size="lg"
          >
            Return to Menu
          </Button>
        </div>

        {/* Message */}
        {isLast && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
            <p className="text-xl font-bold text-yellow-900">
              🌟 Congratulations! You've completed all levels! 🌟
            </p>
            <p className="text-amber-800 mt-2">You are a true treasure hunter!</p>
          </div>
        )}
      </div>
    </div>
  )
}
