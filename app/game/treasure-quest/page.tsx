'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GameScreenPC } from '@/components/GameScreenPC'
import { GameScreenMobile } from '@/components/GameScreenMobile'

export default function TreasureQuestPage() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const savedProgress = localStorage.getItem('treasureGameProgress')
    if (!savedProgress) {
      router.push('/')
      return
    }

    // Detect mobile
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const isPhone = /iPhone|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isSmallScreen = window.innerWidth < 768
    setIsMobile(isPhone || isSmallScreen)
    setIsHydrated(true)
  }, [router])

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
