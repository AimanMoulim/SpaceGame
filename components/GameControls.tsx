'use client'

import React from "react"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

interface GameControlsProps {
  engineRef: React.RefObject<any>
  isMobile: boolean
}

export function GameControls({ engineRef, isMobile }: GameControlsProps) {
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const isJumpActiveRef = useRef(false)
  const leftPressedRef = useRef(false)
  const rightPressedRef = useRef(false)

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
          if (!rightPressedRef.current) {
            engineRef.current?.moveRight()
            rightPressedRef.current = true
            leftPressedRef.current = false
          }
        } else {
          if (!leftPressedRef.current) {
            engineRef.current?.moveLeft()
            leftPressedRef.current = true
            rightPressedRef.current = false
          }
        }
      }
    }

    const handleTouchEnd = () => {
      touchStartXRef.current = null
      touchStartYRef.current = null
      engineRef.current?.stopMove()
      leftPressedRef.current = false
      rightPressedRef.current = false
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
    leftPressedRef.current = true
    engineRef.current?.moveLeft()
  }

  const handleRightPress = () => {
    rightPressedRef.current = true
    engineRef.current?.moveRight()
  }

  const handleJump = () => {
    if (!isJumpActiveRef.current) {
      isJumpActiveRef.current = true
      engineRef.current?.jump()
    }
  }

  const handleLeftRelease = () => {
    leftPressedRef.current = false
    if (!rightPressedRef.current) {
      engineRef.current?.stopMove()
    }
  }

  const handleRightRelease = () => {
    rightPressedRef.current = false
    if (!leftPressedRef.current) {
      engineRef.current?.stopMove()
    }
  }

  const handleJumpRelease = () => {
    isJumpActiveRef.current = false
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-2 px-2 sm:gap-3 sm:px-4 sm:bottom-6 z-50">
      <div className="flex gap-2 sm:gap-3 touch-none select-none">
        <Button
          onMouseDown={handleLeftPress}
          onMouseUp={handleLeftRelease}
          onTouchStart={handleLeftPress}
          onTouchEnd={handleLeftRelease}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xl sm:text-2xl font-bold rounded-xl active:scale-95 transition-all shadow-lg"
        >
          ◀
        </Button>
        <Button
          onMouseDown={handleJump}
          onMouseUp={handleJumpRelease}
          onTouchStart={handleJump}
          onTouchEnd={handleJumpRelease}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xl sm:text-2xl font-bold rounded-xl active:scale-95 transition-all shadow-lg"
        >
          ⬆
        </Button>
        <Button
          onMouseDown={handleRightPress}
          onMouseUp={handleRightRelease}
          onTouchStart={handleRightPress}
          onTouchEnd={handleRightRelease}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xl sm:text-2xl font-bold rounded-xl active:scale-95 transition-all shadow-lg"
        >
          ▶
        </Button>
      </div>
    </div>
  )
}
