'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UsernameSetup } from '@/components/UsernameSetup'

export default function Page() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user is already authenticated
    const savedProgress = localStorage.getItem('treasureGameProgress')
    if (savedProgress) {
      const data = JSON.parse(savedProgress)
      if (data.userId) {
        // Redirect to platform dashboard
        router.push('/platform/dashboard')
      }
    }
  }, [router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-green-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">⚡</div>
          <p className="text-slate-700 font-semibold">Loading adventure...</p>
        </div>
      </div>
    )
  }

  const handleUsernameSet = (userId: string, username: string) => {
    localStorage.setItem(
      'treasureGameProgress',
      JSON.stringify({
        userId,
        username,
        currentLevel: 1,
        soundEnabled: true
      })
    )
    router.push('/platform/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-green-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <UsernameSetup onUsernameSet={handleUsernameSet} />
      </div>
    </div>
  )
}
