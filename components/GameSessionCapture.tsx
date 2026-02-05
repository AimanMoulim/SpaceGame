'use client'

import { useEffect, useRef, useState } from 'react'
import { GameScreenPC } from './GameScreenPC'
import { GameScreenMobile } from './GameScreenMobile'

interface GameSessionData {
  levelReached: number
  gemsCollected: number
  score: number
  completed: boolean
  duration: number
}

interface GameSessionCaptureProps {
  userId: string
  username: string
  isMobile: boolean
  onSessionEnd: (data: GameSessionData) => void
}

export function GameSessionCapture({
  userId,
  username,
  isMobile,
  onSessionEnd
}: GameSessionCaptureProps) {
  const gameRefPC = useRef<any>(null)
  const gameRefMobile = useRef<any>(null)
  const sessionStartRef = useRef(Date.now())
  const [sessionData, setSessionData] = useState<GameSessionData>({
    levelReached: 1,
    gemsCollected: 0,
    score: 0,
    completed: false,
    duration: 0
  })

  // Capture game data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const gameRef = isMobile ? gameRefMobile : gameRefPC
      
      if (gameRef.current?.gameEngineRef?.current) {
        const engine = gameRef.current.gameEngineRef.current
        setSessionData({
          levelReached: gameRef.current.currentLevelId || 1,
          gemsCollected: engine.player?.gems || 0,
          score: (engine.player?.gems || 0) * 10,
          completed: engine.levelComplete || false,
          duration: Math.floor((Date.now() - sessionStartRef.current) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isMobile])

  // Call onSessionEnd when component unmounts
  useEffect(() => {
    return () => {
      const finalData = {
        ...sessionData,
        duration: Math.floor((Date.now() - sessionStartRef.current) / 1000)
      }
      onSessionEnd(finalData)
      console.log('[v0] Game session ended with data:', finalData)
    }
  }, [sessionData, onSessionEnd])

  if (isMobile) {
    return (
      <GameScreenMobile 
        ref={gameRefMobile}
        userId={userId}
        username={username}
      />
    )
  }

  return (
    <GameScreenPC 
      ref={gameRefPC}
      userId={userId}
      username={username}
    />
  )
}
