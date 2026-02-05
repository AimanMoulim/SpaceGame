'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GameScreenWrapper } from '@/components/GameScreenWrapper'
import { saveGameSession } from '@/lib/platformService'

export default function TreasureQuestPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionStartTime] = useState(Date.now())

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

  useEffect(() => {
    return () => {
      // Save game session when leaving
      if (userId) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000)
        saveGameSession(userId, 'treasure-quest', sessionDuration)
      }
    }
  }, [userId, sessionStartTime])

  if (loading || !userId || !username) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-green-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">🎮</div>
          <p className="text-slate-700 font-semibold">Loading Treasure Quest...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-green-200">
      <GameScreenWrapper />
    </div>
  )
}
