'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { initializeUserProfile } from '@/lib/firebaseService'

interface UsernameSetupProps {
  onUsernameSet: (userId: string, username: string) => void
}

export function UsernameSetup({ onUsernameSet }: UsernameSetupProps) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters')
      return
    }

    if (username.trim().length > 20) {
      setError('Username must be at most 20 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create a simple user ID based on username + timestamp
      const userId = `user_${username}_${Date.now()}`
      
      // Initialize user profile in Firebase
      const success = await initializeUserProfile(userId, username.trim())
      
      if (success) {
        onUsernameSet(userId, username.trim())
      } else {
        setError('Failed to create profile. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-yellow-100 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-amber-900 drop-shadow-lg">
            🏜️ Treasure Quest
          </h1>
          <p className="text-lg text-amber-800">Welcome, Explorer!</p>
        </div>

        {/* Username Form */}
        <div className="bg-white/90 rounded-lg p-8 shadow-lg space-y-4">
          <h2 className="text-2xl font-bold text-amber-900">Enter Your Name</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Explorer's name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="text-center text-lg py-6 border-2 border-amber-300"
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">{username.length}/20 characters</p>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-lg py-6 bg-amber-600 hover:bg-amber-700 text-white"
              size="lg"
            >
              {loading ? '⏳ Creating Profile...' : '▶ Start Adventure'}
            </Button>
          </form>

          <p className="text-xs text-amber-700">
            Your progress will be saved in the cloud!
          </p>
        </div>
      </div>
    </div>
  )
}
