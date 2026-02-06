'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CrystalMatchGame } from '@/components/CrystalMatchGame'
import { recordGameSession, type GameSession } from '@/lib/platformService'

export default function CrystalMatchPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const sessionStartTimeRef = useRef(Date.now())
  const sessionDataRef = useRef({
    levelReached: 1,
    gemsCollected: 0,
    score: 0,
    completed: false
  })

  useEffect(() => {
    const savedProgress = localStorage.getItem('treasureGameProgress')
    if (!savedProgress) {
      router.push('/')
      return
    }

    try {
      const data = JSON.parse(savedProgress)
      setUserId(data.userId)
      setIsHydrated(true)
    } catch (error) {
      console.error('[v0] Error parsing user data:', error)
      router.push('/')
    }
  }, [router])

  const handleSessionData = (data: any) => {
    sessionDataRef.current = data
  }

  useEffect(() => {
    return () => {
      if (userId && sessionDataRef.current) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)

        const gameSession: GameSession = {
          gameId: 'crystal-match',
          gameName: 'Crystal Match',
          startTime: sessionStartTimeRef.current,
          endTime: Date.now(),
          duration: sessionDuration,
          levelReached: sessionDataRef.current.levelReached,
          gemsCollected: sessionDataRef.current.gemsCollected,
          score: sessionDataRef.current.score,
          completed: sessionDataRef.current.completed
        }

        recordGameSession(userId, gameSession).catch(error =>
          console.error('[v0] Error recording session:', error)
        )
      }
    }
  }, [userId])

  if (!isHydrated || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">💎</div>
          <p className="text-white font-semibold">Loading Crystal Match...</p>
        </div>
      </div>
    )
  }

  return <CrystalMatchGame onSessionData={handleSessionData} />
}
