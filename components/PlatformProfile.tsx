'use client'

import { useEffect, useState } from 'react'
import { getPlayerProfile } from '@/lib/platformService'

interface PlatformProfileProps {
  userId: string
  username: string
}

export function PlatformProfile({ userId, username }: PlatformProfileProps) {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [displayName, setDisplayName] = useState(username)

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const data = await getPlayerProfile(userId)
      setProfile(data.profile)
      setStats(data.stats)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-spin">⚡</div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{username}</h1>
            <p className="text-slate-400">
              {profile?.createdAt ? `Member since ${new Date(profile.createdAt).toLocaleDateString()}` : 'Active player'}
            </p>
          </div>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold transition-all"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold transition-all"
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProfileStatBox
          title="Rank"
          value="#1"
          icon="🏆"
          description="Global leaderboard position"
        />
        <ProfileStatBox
          title="Level"
          value={stats?.highestLevel || 0}
          icon="📈"
          description={`Highest level reached: ${stats?.highestLevel || 0}`}
        />
        <ProfileStatBox
          title="Achievements"
          value={stats?.achievements?.length || 0}
          icon="⭐"
          description="Badges and rewards"
        />
      </div>

      {/* Achievements Section */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { icon: '🌟', name: 'First Steps', desc: 'Complete level 1' },
            { icon: '💎', name: 'Gem Collector', desc: 'Collect 100 gems' },
            { icon: '⚡', name: 'Speed Runner', desc: 'Complete in 1 min' },
            { icon: '🎯', name: 'Perfect Score', desc: 'Score 1000+ pts' },
            { icon: '🏔️', name: 'Mountain Climber', desc: 'Reach level 5' },
            { icon: '👑', name: 'Champion', desc: 'Top leaderboard' }
          ].map((achievement, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4 text-center hover:border-yellow-500/30 transition-colors cursor-pointer"
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{achievement.name}</h3>
              <p className="text-xs text-slate-400">{achievement.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4">Gaming Stats</h3>
          <div className="space-y-3">
            <StatRow label="Total Games" value={stats?.totalGamesPlayed || 0} />
            <StatRow label="Gems Collected" value={stats?.totalGemsCollected || 0} />
            <StatRow label="Play Time" value={`${Math.round((stats?.totalPlayTime || 0) / 3600)}h`} />
            <StatRow label="Average Score" value={Math.round(stats?.averageScore || 0)} />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4">Account Settings</h3>
          <div className="space-y-3">
            <div className="pb-3 border-b border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Username</p>
              <p className="font-semibold">{username}</p>
            </div>
            <div className="pb-3 border-b border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Account Type</p>
              <p className="font-semibold">Premium Player</p>
            </div>
            <div className="pb-3 border-b border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Total Play Sessions</p>
              <p className="font-semibold">{stats?.totalGamesPlayed || 0} sessions</p>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg font-medium transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProfileStatBoxProps {
  title: string
  value: string | number
  icon: string
  description: string
}

function ProfileStatBox({ title, value, icon, description }: ProfileStatBoxProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-sm text-slate-400 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-yellow-400 mb-2">{value}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  )
}

interface StatRowProps {
  label: string
  value: string | number
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="font-bold text-yellow-400">{value}</span>
    </div>
  )
}
