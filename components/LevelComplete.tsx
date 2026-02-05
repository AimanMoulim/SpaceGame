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
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-orange-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Celebration */}
        <div className="text-7xl animate-bounce">🎉</div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-amber-900">Level Complete!</h1>

        {/* Stats */}
        <div className="bg-white/90 rounded-lg p-8 shadow-lg space-y-4">
          <div className="text-2xl text-amber-900">
            <p className="font-bold mb-4">Great Job, {username}!</p>

            <div className="space-y-3 text-lg">
              <p>💎 Gems Collected: {gems}</p>
              <p>❤️ Lives Remaining: {lives}/3</p>
              <p>⭐ Bonus: {lives > 1 ? '+' + lives * 10 : 'Safe completion!'}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 flex flex-col">
          {!isLast ? (
            <Button
              onClick={onNextLevel}
              className="text-lg py-6 bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              ▶ Next Level
            </Button>
          ) : (
            <Button
              onClick={onNextLevel}
              className="text-lg py-6 bg-yellow-600 hover:bg-yellow-700 text-white"
              size="lg"
            >
              🏆 You Completed the Game!
            </Button>
          )}

          <Button
            onClick={onMenu}
            className="text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white"
            variant="default"
            size="lg"
          >
            🏠 Return to Menu
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
