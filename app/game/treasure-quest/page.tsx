'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GameScreenPC } from '@/components/GameScreenPC'
import { GameScreenMobile } from '@/components/GameScreenMobile'
import { recordGameSession, type GameSession } from '@/lib/platformService'

export default function TreasureQuestPage() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const sessionStartTimeRef = useRef(Date.now())

  useEffect(() => {
    const savedProgress = localStorage.getItem('treasureGameProgress')
    if (!savedProgress) {
      router.push('/')
      return
    }

    try {
      const data = JSON.parse(savedProgress)
      setUserId(data.userId)

      // Detect mobile
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
      const isPhone = /iPhone|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isSmallScreen = window.innerWidth < 768
      setIsMobile(isPhone || isSmallScreen)
      setIsHydrated(true)
    } catch (error) {
      console.error('[v0] Error parsing user data:', error)
      router.push('/')
    }
  }, [router])

  // Record game session when leaving
  useEffect(() => {
    return () => {
      if (userId) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)
        
        const gameSession: GameSession = {
          gameId: 'treasure-quest',
          gameName: 'Treasure Quest',
          startTime: sessionStartTimeRef.current,
          endTime: Date.now(),
          duration: sessionDuration,
          levelReached: 1,
          gemsCollected: 0,
          score: 0,
          completed: false
        }
        
        recordGameSession(userId, gameSession).catch(error => 
          console.error('[v0] Error recording session:', error)
        )
      }
    }
  }, [userId])

  if (!isHydrated) {
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
      {isMobile ? <GameScreenMobile /> : <GameScreenPC />}
    </div>
  )
}
