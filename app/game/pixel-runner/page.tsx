'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PixelRunnerGame } from '@/components/PixelRunnerGame'
import { recordGameSession, type GameSession } from '@/lib/platformService'

export default function PixelRunnerPage() {
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
          gameId: 'pixel-runner',
          gameName: 'Pixel Runner',
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
      <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">🏃</div>
          <p className="text-white font-semibold">Loading Pixel Runner...</p>
        </div>
      </div>
    )
  }

  return <PixelRunnerGame onSessionData={handleSessionData} />
}
