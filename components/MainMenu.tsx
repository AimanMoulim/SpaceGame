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
}

export function MainMenu({ onStartGame, soundEnabled, onToggleSound }: MainMenuProps) {
  const [showLevelSelect, setShowLevelSelect] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-yellow-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-amber-900 drop-shadow-lg">
            🏜️ Treasure of the Lost Oasis
          </h1>
          <p className="text-xl text-amber-800">An adventure awaits!</p>
        </div>

        {/* Game Info */}
        <div className="bg-white/80 rounded-lg p-6 shadow-lg space-y-3">
          <h2 className="text-2xl font-bold text-amber-900">Welcome, Explorer!</h2>
          <p className="text-amber-800">
            Explore mystical lands, collect shimmering gems, and reach the exit safely.
          </p>
          <p className="text-sm text-amber-700">
            Watch out for spikes and lava! Use your 3 lives wisely.
          </p>
        </div>

        {/* Buttons */}
        {!showLevelSelect ? (
          <div className="space-y-3 flex flex-col">
            <Button
              onClick={() => onStartGame(1)}
              className="text-lg py-6 bg-amber-600 hover:bg-amber-700 text-white"
              size="lg"
            >
              ▶ Start Game
            </Button>

            <Button
              onClick={() => setShowLevelSelect(true)}
              className="text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white"
              variant="default"
              size="lg"
            >
              📍 Level Select
            </Button>

            <Button
              onClick={onToggleSound}
              className="text-lg py-6 bg-green-600 hover:bg-green-700 text-white"
              variant="default"
              size="lg"
            >
              {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-amber-900">Select Level</h3>
            <div className="grid grid-cols-2 gap-3">
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
