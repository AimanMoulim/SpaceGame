/**
 * Main Menu Component
 * Displays game title, start button, and level selection
 */

'use client'

import { useState } from 'react'
import { LEVELS } from '@/lib/levels'
import { Button } from '@/components/ui/button'
import { PlayerProgress } from './PlayerProgress'

interface MainMenuProps {
  onStartGame: (levelId: number) => void
  soundEnabled: boolean
  onToggleSound: () => void
  username?: string | null
  userId?: string | null
}

export function MainMenu({ onStartGame, soundEnabled, onToggleSound, username, userId }: MainMenuProps) {
  const [showLevelSelect, setShowLevelSelect] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 flex items-center justify-center p-2 sm:p-4 overflow-x-hidden">
      <div className="text-center space-y-4 sm:space-y-8 max-w-2xl w-full">
        {/* Title */}
        <div className="space-y-1 sm:space-y-3">
          <h1 className="text-4xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600">
            Treasure Quest
          </h1>
          <p className="text-base sm:text-xl text-slate-600 font-medium">An epic adventure awaits!</p>
        </div>

        {/* Game Info */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-3 sm:space-y-4 text-center backdrop-blur-sm">
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900">Welcome back, {username}!</h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Explore mystical lands, collect shimmering gems, and reach the exit safely.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 bg-blue-50 rounded-lg py-2 px-3">
            Stay alert for hazards ahead! You have 3 lives to complete each level.
          </p>
        </div>

        {/* Buttons */}
        {!showLevelSelect ? (
          <div className="space-y-2 sm:space-y-3 flex flex-col">
            <Button
              onClick={() => onStartGame(1)}
              className="text-sm sm:text-lg py-4 sm:py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold shadow-lg rounded-xl transition-all hover:shadow-xl"
              size="lg"
            >
              Play Now
            </Button>

            <Button
              onClick={() => setShowLevelSelect(true)}
              className="text-sm sm:text-lg py-4 sm:py-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold shadow-lg rounded-xl transition-all hover:shadow-xl"
              variant="default"
              size="lg"
            >
              Level Select
            </Button>

            {userId && (
              <Button
                onClick={() => setShowProgress(true)}
                className="text-sm sm:text-lg py-4 sm:py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg rounded-xl transition-all hover:shadow-xl"
                variant="default"
                size="lg"
              >
                My Progress
              </Button>
            )}

            <Button
              onClick={onToggleSound}
              className="text-sm sm:text-lg py-4 sm:py-6 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold shadow-lg rounded-xl transition-all hover:shadow-xl"
              variant="default"
              size="lg"
            >
              {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Select Your Level</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-100">
              {LEVELS.map((level) => (
                <Button
                  key={level.id}
                  onClick={() => onStartGame(level.id)}
                  className="text-xs sm:text-base py-3 sm:py-4 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg"
                  size="lg"
                >
                  <span className="text-lg sm:text-xl">{level.id}.</span> {level.name}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setShowLevelSelect(false)}
              className="text-sm sm:text-lg py-4 sm:py-6 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-bold rounded-xl shadow-lg transition-all hover:shadow-xl w-full"
              variant="default"
              size="lg"
            >
              Back to Menu
            </Button>
          </div>
        )}

        {/* Footer */}
        <p className="text-sm text-amber-700 pt-4"></p>
      </div>

      {showProgress && userId && username && (
        <PlayerProgress
          userId={userId}
          username={username}
          onClose={() => setShowProgress(false)}
        />
      )}
    </div>
  )
}
