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
    <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 px-4">
      <div className="flex gap-2">
        <Button
          onMouseDown={handleLeftPress}
          onMouseUp={handleLeftRelease}
          onTouchStart={handleLeftPress}
          onTouchEnd={handleLeftRelease}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold rounded-lg"
        >
          ◀
        </Button>
        <Button
          onMouseDown={handleJump}
          className="w-16 h-16 bg-green-600 hover:bg-green-700 text-white text-2xl font-bold rounded-lg"
        >
          ⬆
        </Button>
        <Button
          onMouseDown={handleRightPress}
          onMouseUp={handleRightRelease}
          onTouchStart={handleRightPress}
          onTouchEnd={handleRightRelease}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold rounded-lg"
        >
          ▶
        </Button>
      </div>
    </div>
  )
}
