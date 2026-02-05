'use client'

import { useEffect, useState } from 'react'
import { PlayerStats, GameSession, getPlayerStats, getPlayerSessions } from '@/lib/platformService'

interface PlatformDashboardProps {
  userId: string
  username: string
}

export function PlatformDashboard({ userId, username }: PlatformDashboardProps) {
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [sessions, setSessions] = useState<GameSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [playerStats, recentSessions] = await Promise.all([
        getPlayerStats(userId),
        getPlayerSessions(userId, 5)
      ])
      setStats(playerStats)
      setSessions(recentSessions)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-spin">⚡</div>
          <p className="text-slate-400">Loading your adventure data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {username}!</h1>
        <p className="text-slate-400">Your gaming adventure continues. Check your stats below.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Games Played"
          value={stats?.totalGamesPlayed || 0}
          icon="🎮"
          change={12}
        />
        <StatCard
          label="Total Gems"
          value={stats?.totalGemsCollected || 0}
          icon="💎"
          change={245}
        />
        <StatCard
          label="Highest Level"
          value={stats?.highestLevel || 0}
          icon="🏔️"
          change={3}
        />
        <StatCard
          label="Play Time (hrs)"
          value={Math.round((stats?.totalPlayTime || 0) / 3600)}
          icon="⏱️"
          change={12}
        />
      </div>

      {/* Recent Sessions */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6">Recent Sessions</h2>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4 flex items-center justify-between hover:border-yellow-500/30 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{session.gameName}</h3>
                  <p className="text-sm text-slate-400">Level {session.levelReached} • {session.gemsCollected} gems</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-400">{session.score} pts</p>
                  <p className="text-xs text-slate-400">{session.completed ? '✓ Completed' : 'In Progress'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <p>No sessions yet. Start playing to see your history!</p>
          </div>
        )}
      </div>

      {/* Average Score */}
      {stats && (
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4">Current Average Score</h3>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="h-24 bg-slate-800 rounded-lg flex items-end p-2">
                <div
                  className="w-full bg-gradient-to-t from-yellow-500 to-orange-500 rounded-t"
                  style={{ height: `${Math.min((stats.averageScore || 0) / 5, 100)}%` }}
                />
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{Math.round(stats.averageScore || 0)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  icon: string
  change: number
}

function StatCard({ label, value, icon, change }: StatCardProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-green-400 font-semibold">+{change}</span>
      </div>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}
