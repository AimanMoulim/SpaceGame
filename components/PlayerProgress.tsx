'use client'

import { useEffect, useState } from 'react'
import { getUserProgress } from '@/lib/firebaseService'
import { LEVELS } from '@/lib/levels'

interface PlayerProgressProps {
  userId: string
  username: string
  onClose: () => void
}

export function PlayerProgress({ userId, username, onClose }: PlayerProgressProps) {
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      const data = await getUserProgress(userId)
      setProgress(data)
      setLoading(false)
    }
    loadProgress()
  }, [userId])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-amber-900 font-semibold">Loading progress...</p>
        </div>
      </div>
    )
  }

  const completedLevels = progress?.levelsCompleted?.length || 0
  const totalGems = progress?.totalGemsCollected || 0
  const bestScores = progress?.bestScores || {}

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-lg p-4 sm:p-6 shadow-2xl max-w-2xl w-full my-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-900">{username}</h2>
            <p className="text-xs sm:text-sm text-amber-700">Player Statistics</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow">
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{completedLevels}</p>
            <p className="text-xs sm:text-sm text-gray-600">Levels Completed</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{totalGems}</p>
            <p className="text-xs sm:text-sm text-gray-600">Total Gems</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow">
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {Math.round((completedLevels / LEVELS.length) * 100)}%
            </p>
            <p className="text-xs sm:text-sm text-gray-600">Progress</p>
          </div>
        </div>

        {/* Level Details */}
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow">
          <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-3 sm:mb-4">Level Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-80 overflow-y-auto">
            {LEVELS.map((level) => {
              const isCompleted = progress?.levelsCompleted?.includes(level.id)
              const bestScore = bestScores[level.id] || 0

              return (
                <div
                  key={level.id}
                  className={`p-3 sm:p-4 rounded-lg border-2 ${
                    isCompleted
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <div>
                      <p className="font-bold text-sm sm:text-base text-amber-900">
                        {level.id}. {level.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {isCompleted ? 'Completed ✓' : 'Not completed'}
                      </p>
                    </div>
                    {bestScore > 0 && (
                      <p className="text-sm sm:text-base font-bold text-blue-600">
                        {bestScore}
                      </p>
                    )}
                  </div>
                  {bestScore > 0 && (
                    <p className="text-xs text-gray-600">Gems: {bestScore}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 sm:mt-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
