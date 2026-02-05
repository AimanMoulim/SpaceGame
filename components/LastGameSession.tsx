'use client'

import { useEffect, useState } from 'react'
import { getPlayerSessions, type GameSession } from '@/lib/platformService'

interface LastGameSessionProps {
  userId: string
}

export function LastGameSession({ userId }: LastGameSessionProps) {
  const [lastSession, setLastSession] = useState<GameSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLastSession()
  }, [userId])

  const loadLastSession = async () => {
    setLoading(true)
    try {
      const sessions = await getPlayerSessions(userId, 1)
      if (sessions.length > 0) {
        setLastSession(sessions[0])
      }
    } catch (error) {
      console.error('Error loading last session:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
        <p className="text-sm text-slate-400">Loading last session...</p>
      </div>
    )
  }

  if (!lastSession) {
    return (
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
        <p className="text-sm text-slate-400">No games played yet</p>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4">Last Game Session</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Gems Collected</p>
          <p className="text-2xl font-bold text-yellow-400">💎 {lastSession.gemsCollected}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Level Reached</p>
          <p className="text-2xl font-bold text-blue-400">🏔️ {lastSession.levelReached}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Score</p>
          <p className="text-2xl font-bold text-purple-400">⭐ {lastSession.score}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Duration</p>
          <p className="text-2xl font-bold text-green-400">⏱️ {formatTime(lastSession.duration || 0)}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500">
          Played {lastSession.completed ? '✓ Completed' : '○ In Progress'} • {formatDate(lastSession.startTime)}
        </p>
      </div>
    </div>
  )
}
