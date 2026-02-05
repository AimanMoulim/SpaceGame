'use client'

import React from "react"

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface GameControlsProps {
  engineRef: React.RefObject<any>
  isMobile: boolean
}

export function GameControls({ engineRef, isMobile }: GameControlsProps) {
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0]?.clientX ?? null
      touchStartYRef.current = e.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartXRef.current === null) return

      const currentX = e.touches[0]?.clientX ?? 0
      const diffX = currentX - touchStartXRef.current

      if (Math.abs(diffX) > 10) {
        e.preventDefault()
        if (diffX > 0) {
          engineRef.current?.moveRight()
        } else {
          engineRef.current?.moveLeft()
        }
      }
    }

    const handleTouchEnd = () => {
      touchStartXRef.current = null
      touchStartYRef.current = null
      engineRef.current?.stopMove()
    }

    window.addEventListener('touchstart', handleTouchStart, false)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, false)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMobile, engineRef])

  if (!isMobile) return null

  const handleLeftPress = () => {
    engineRef.current?.moveLeft()
  }

  const handleRightPress = () => {
    engineRef.current?.moveRight()
  }

  const handleJump = () => {
    engineRef.current?.jump()
  }

  const handleLeftRelease = () => {
    engineRef.current?.stopMove()
  }

  const handleRightRelease = () => {
    engineRef.current?.stopMove()
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-2 px-2 sm:gap-3 sm:px-4 sm:bottom-6 z-50">
      <div className="flex gap-2 sm:gap-3 touch-none select-none">
        <Button
          onMouseDown={handleLeftPress}
          onMouseUp={handleLeftRelease}
          onTouchStart={handleLeftPress}
          onTouchEnd={handleLeftRelease}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl sm:text-2xl font-bold rounded-lg active:scale-95 transition-transform"
        >
          ◀
        </Button>
        <Button
          onMouseDown={handleJump}
          onMouseUp={handleJump}
          onTouchStart={handleJump}
          onTouchEnd={handleJump}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 hover:bg-green-700 text-white text-xl sm:text-2xl font-bold rounded-lg active:scale-95 transition-transform"
        >
          ⬆
        </Button>
        <Button
          onMouseDown={handleRightPress}
          onMouseUp={handleRightRelease}
          onTouchStart={handleRightPress}
          onTouchEnd={handleRightRelease}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl sm:text-2xl font-bold rounded-lg active:scale-95 transition-transform"
        >
          ▶
        </Button>
      </div>
    </div>
  )
}
