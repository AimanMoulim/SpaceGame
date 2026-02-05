'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { GameScreenPC } from '@/components/GameScreenPC'
import { GameScreenMobile } from '@/components/GameScreenMobile'
import { recordGameSession, type GameSession } from '@/lib/platformService'

interface GameSessionData {
  levelReached: number
  gemsCollected: number
  score: number
  completed: boolean
}

export default function TreasureQuestPage() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const sessionStartTimeRef = useRef(Date.now())
  const sessionDataRef = useRef<GameSessionData>({
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
      setUsername(data.username)

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

  // Callback to receive game session data from child components
  const handleSessionData = useCallback((data: GameSessionData) => {
    console.log('[v0] Received game session data:', data)
    sessionDataRef.current = data
  }, [])

  // Record game session with real data when leaving
  useEffect(() => {
    return () => {
      if (userId && sessionDataRef.current) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)
        
        const gameSession: GameSession = {
          gameId: 'treasure-quest',
          gameName: 'Treasure Quest',
          startTime: sessionStartTimeRef.current,
          endTime: Date.now(),
          duration: sessionDuration,
          levelReached: sessionDataRef.current.levelReached,
          gemsCollected: sessionDataRef.current.gemsCollected,
          score: sessionDataRef.current.score,
          completed: sessionDataRef.current.completed
        }
        
        console.log('[v0] Recording final game session:', gameSession)
        recordGameSession(userId, gameSession).catch(error => 
          console.error('[v0] Error recording session:', error)
        )
      }
    }
  }, [userId])

  if (!isHydrated || !userId) {
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
      {isMobile ? (
        <GameScreenMobileWithCapture 
          userId={userId}
          username={username}
          onSessionData={handleSessionData}
        />
      ) : (
        <GameScreenPCWithCapture 
          userId={userId}
          username={username}
          onSessionData={handleSessionData}
        />
      )}
    </div>
  )
}

// Wrapper to capture data from GameScreenPC
function GameScreenPCWithCapture({ userId, username, onSessionData }: any) {
  const gameRef = useRef<any>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameRef.current?.gameEngineRef?.current) {
        const engine = gameRef.current.gameEngineRef.current
        onSessionData({
          levelReached: gameRef.current.currentLevelId || 1,
          gemsCollected: engine.player?.gems || 0,
          score: (engine.player?.gems || 0) * 10,
          completed: engine.levelComplete || false
        })
      }
    }, 500)

    return () => clearInterval(interval)
  }, [onSessionData])

  return <GameScreenPC ref={gameRef} />
}

// Wrapper to capture data from GameScreenMobile
function GameScreenMobileWithCapture({ userId, username, onSessionData }: any) {
  const gameRef = useRef<any>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameRef.current?.gameEngineRef?.current) {
        const engine = gameRef.current.gameEngineRef.current
        onSessionData({
          levelReached: gameRef.current.currentLevelId || 1,
          gemsCollected: engine.player?.gems || 0,
          score: (engine.player?.gems || 0) * 10,
          completed: engine.levelComplete || false
        })
      }
    }, 500)

    return () => clearInterval(interval)
  }, [onSessionData])

  return <GameScreenMobile ref={gameRef} />
}
