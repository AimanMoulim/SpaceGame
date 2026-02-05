/**
 * Game Screen Wrapper - Detects device type and loads appropriate version
 */

'use client'

import { useState, useEffect } from 'react'
import { GameScreenPC } from './GameScreenPC'
import { GameScreenMobile } from './GameScreenMobile'

export function GameScreenWrapper() {
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Detect if mobile on client side
    const checkMobile = () => {
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
      const isPhone = /iPhone|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isSmallScreen = window.innerWidth < 768

      setIsMobile(isPhone || isSmallScreen)
      setIsHydrated(true)
    }

    checkMobile()

    // Listen for resize events
    const handleResize = () => {
      checkMobile()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Show loading screen until we know the device type
  if (!isHydrated) {
    return (
      <div className="w-screen h-screen bg-gradient-to-b from-blue-300 via-blue-200 to-green-100 flex items-center justify-center">
        <p className="text-slate-900 text-lg font-semibold">Loading game...</p>
      </div>
    )
  }

  // Render appropriate version based on device
  return isMobile ? <GameScreenMobile /> : <GameScreenPC />
}
