/**
 * Main Menu Component
 * Displays game title, start button, and level selection
 */

'use client'

import { useState } from 'react'
import { LEVELS } from '@/lib/levels'
import { Button } from '@/components/ui/button'

interface MainMenuProps {
  onStartGame: (levelId: number) => void
  soundEnabled: boolean
  onToggleSound: () => void
  username?: string | null
}

export function MainMenu({ onStartGame, soundEnabled, onToggleSound, username }: MainMenuProps) {
  const [showLevelSelect, setShowLevelSelect] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-yellow-100 flex items-center justify-center p-2 sm:p-4 overflow-x-hidden">
      <div className="text-center space-y-4 sm:space-y-8 max-w-2xl w-full">
        {/* Title */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-3xl sm:text-6xl font-bold text-amber-900 drop-shadow-lg">
            Treasure Quest
          </h1>
          <p className="text-sm sm:text-xl text-amber-800">An adventure awaits!</p>
        </div>

        {/* Game Info */}
        <div className="bg-white/80 rounded-lg p-4 sm:p-6 shadow-lg space-y-2 sm:space-y-3 text-center">
          <h2 className="text-lg sm:text-2xl font-bold text-amber-900">Welcome, {username}!</h2>
          <p className="text-xs sm:text-base text-amber-800 line-clamp-3">
            Explore mystical lands, collect gems, and reach the exit safely.
          </p>
          <p className="text-xs text-amber-700">
            Watch out for hazards! Use your 3 lives wisely.
          </p>
        </div>

        {/* Buttons */}
        {!showLevelSelect ? (
          <div className="space-y-2 sm:space-y-3 flex flex-col">
            <Button
              onClick={() => onStartGame(1)}
              className="text-sm sm:text-lg py-4 sm:py-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              size="lg"
            >
              Start Game
            </Button>

            <Button
              onClick={() => setShowLevelSelect(false)}
              className="text-sm sm:text-lg py-4 sm:py-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold"
              variant="default"
              size="lg"
            >
              Back
            </Button>

            <Button
              onClick={onToggleSound}
              className="text-sm sm:text-lg py-4 sm:py-6 bg-green-600 hover:bg-green-700 text-white font-semibold"
              variant="default"
              size="lg"
            >
              {soundEnabled ? 'Sound On' : 'Sound Off'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-2xl font-bold text-amber-900">Select Level</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {LEVELS.map((level) => (
                <Button
                  key={level.id}
                  onClick={() => onStartGame(level.id)}
                  className="text-lg py-6 bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                >
                  {level.id}. {level.name}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setShowLevelSelect(false)}
              className="text-lg py-4 bg-gray-600 hover:bg-gray-700 text-white w-full"
              variant="default"
            >
              ← Back
            </Button>
          </div>
        )}

        {/* Footer */}
        <p className="text-sm text-amber-700 pt-4">
          Built with ❤️ for all ages | Halal • Non-violent • Family-friendly
        </p>
      </div>
    </div>
  )
}
