'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlatformShell } from '@/components/PlatformShell'
import { PlatformDashboard } from '@/components/PlatformDashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedProgress = localStorage.getItem('treasureGameProgress')
    if (!savedProgress) {
      router.push('/')
      return
    }

    try {
      const data = JSON.parse(savedProgress)
      setUserId(data.userId)
      setUsername(data.username)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('treasureGameProgress')
    router.push('/')
  }

  if (loading || !userId || !username) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⚡</div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <PlatformShell
      userId={userId}
      username={username}
      currentPage="dashboard"
      onLogout={handleLogout}
    >
      <PlatformDashboard userId={userId} username={username} />
    </PlatformShell>
  )
}
