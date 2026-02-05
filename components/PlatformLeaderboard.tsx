'use client'

import { useEffect, useState } from 'react'
import { getGlobalLeaderboard } from '@/lib/platformService'

interface LeaderboardEntry {
  userId: string
  username: string
  score: number
  level: number
  totalGems: number
  rank: number
  lastPlayed: number
}

interface PlatformLeaderboardProps {
  userId: string
  username: string
}

export function PlatformLeaderboard({ userId, username }: PlatformLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'global' | 'weekly'>('global')
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    loadLeaderboard()
  }, [filterType])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const data = await getGlobalLeaderboard(100)
      setLeaderboard(data)
      
      // Find user rank
      const rank = data.find(entry => entry.userId === userId)
      if (rank) {
        setUserRank(rank)
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Global Leaderboard</h1>
            <p className="text-slate-400">Compete with players worldwide</p>
          </div>
          <div className="text-5xl">🏆</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType('global')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filterType === 'global'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setFilterType('weekly')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filterType === 'weekly'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Weekly
        </button>
      </div>

      {/* User's Rank Card */}
      {userRank && (
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl font-bold">
                {userRank.rank}
              </div>
              <div>
                <p className="text-sm text-slate-400">Your Position</p>
                <p className="text-xl font-bold">{userRank.username} • Rank #{userRank.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Score</p>
              <p className="text-3xl font-bold text-yellow-400">{Math.round(userRank.score)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-4xl animate-spin mb-4">⚡</div>
              <p className="text-slate-400">Loading leaderboard...</p>
            </div>
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700/50 bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Player</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Score</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Level</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Gems</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.userId}
                    className={`border-b border-slate-700/20 transition-colors ${
                      entry.userId === userId
                        ? 'bg-purple-900/20 hover:bg-purple-900/30'
                        : 'hover:bg-slate-800/50'
                    } ${index < 3 ? 'bg-slate-800/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {index < 3 ? (
                          <span className="text-2xl">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="font-bold text-slate-400">#{entry.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{entry.username}</p>
                        {entry.userId === userId && (
                          <p className="text-xs text-blue-400">You</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-yellow-400">{Math.round(entry.score)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-slate-300">Level {entry.level}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-cyan-400">{entry.totalGems}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <p className="text-slate-400">No leaderboard data available yet.</p>
          </div>
        )}
      </div>

      {/* Top Players Spotlight */}
      {leaderboard.slice(0, 3).length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Players Spotlight</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboard.slice(0, 3).map((player, index) => {
              const medals = ['🥇', '🥈', '🥉']
              return (
                <div
                  key={player.userId}
                  className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm text-center"
                >
                  <div className="text-5xl mb-2">{medals[index]}</div>
                  <h3 className="text-lg font-bold mb-2">{player.username}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-yellow-400 font-semibold">
                      {Math.round(player.score)} pts
                    </p>
                    <p className="text-slate-400">Level {player.level}</p>
                    <p className="text-cyan-400">{player.totalGems} gems</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
