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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4 sm:space-y-6">
        {/* Title */}
        <div className="text-center space-y-1 sm:space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600">
            Treasure Quest
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">Begin your adventure</p>
        </div>

        {/* Username Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-4 border border-slate-100 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center">
            {isLogin ? 'Login to Your Account' : 'Create Your Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter your explorer name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="text-center text-sm sm:text-base py-3 sm:py-4 border-2 border-slate-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                maxLength={20}
                autoComplete="off"
              />
              <p className="text-xs text-slate-500 mt-2 text-center">{username.length}/20 characters</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <p className="text-red-700 text-xs sm:text-sm font-semibold">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-base sm:text-lg py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              size="lg"
            >
              {loading ? 'Starting adventure...' : isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>

          <div className="pt-3 sm:pt-4 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              {isLogin ? 'Create new account' : 'Already have an account? Login here'}
            </button>
          </div>

          <p className="text-xs text-slate-600 text-center pt-2 bg-blue-50 rounded-lg py-2">
            Your progress is saved to the cloud
          </p>
        </div>
      </div>
    </div>
  )
}
