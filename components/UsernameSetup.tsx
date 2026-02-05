'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { initializeUserProfile, checkUsernameExists, getUserByUsername } from '@/lib/firebaseService'

interface UsernameSetupProps {
  onUsernameSet: (userId: string, username: string) => void
}

export function UsernameSetup({ onUsernameSet }: UsernameSetupProps) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(false)

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
      if (isLogin) {
        // Login: Check if username exists
        const existing = await getUserByUsername(username.trim())
        if (existing) {
          onUsernameSet(existing.userId, username.trim())
        } else {
          setError('Username not found. Create a new account?')
        }
      } else {
        // Signup: Check if username already exists
        const exists = await checkUsernameExists(username.trim())
        if (exists) {
          setError('Username already taken! Try another name or login.')
          setIsLogin(true)
        } else {
          const userId = `user_${Date.now()}`
          const success = await initializeUserProfile(userId, username.trim())
          
          if (success) {
            onUsernameSet(userId, username.trim())
          } else {
            setError('Failed to create profile. Please try again.')
          }
        }
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
      <div className="w-full max-w-sm space-y-4 sm:space-y-6">
        {/* Title */}
        <div className="text-center space-y-1 sm:space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 drop-shadow-lg">
            Treasure Quest
          </h1>
          <p className="text-base sm:text-lg text-amber-800">Welcome, Explorer!</p>
        </div>

        {/* Username Form */}
        <div className="bg-white/90 rounded-lg p-6 sm:p-8 shadow-lg space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-900 text-center">
            {isLogin ? 'Login' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="text-center text-sm sm:text-base py-4 sm:py-6 border-2 border-amber-300"
                maxLength={20}
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-1">{username.length}/20 characters</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-2 sm:p-3">
                <p className="text-red-600 text-xs sm:text-sm font-semibold">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-base sm:text-lg py-4 sm:py-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              size="lg"
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>

          <div className="pt-2 sm:pt-4 border-t border-gray-200 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-xs sm:text-sm text-amber-700 hover:text-amber-900 font-semibold"
            >
              {isLogin ? 'Create new account' : 'Already have an account?'}
            </button>
          </div>

          <p className="text-xs text-amber-700 text-center pt-2">
            Progress saved to cloud!
          </p>
        </div>
      </div>
    </div>
  )
}
