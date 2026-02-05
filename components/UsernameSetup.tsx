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
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(false)

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 6) return 'Password must be at least 6 characters'
    if (pwd.length > 50) return 'Password must be at most 50 characters'
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter'
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number'
    return null
  }

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

    if (!password) {
      setError('Please enter a password')
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login: Check username and password
        const existing = await getUserByUsername(username.trim(), password)
        if (existing) {
          onUsernameSet(existing.userId, username.trim())
        } else {
          setError('Invalid username or password')
        }
      } else {
        // Signup: Check if username already exists
        const exists = await checkUsernameExists(username.trim())
        if (exists) {
          setError('Username already taken! Try another name or login.')
          setIsLogin(true)
        } else {
          const userId = `user_${Date.now()}`
          const success = await initializeUserProfile(userId, username.trim(), password)
          
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
            {/* Username Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Username</label>
              <Input
                type="text"
                placeholder="Enter your explorer name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full text-sm sm:text-base py-2 sm:py-3 px-3 border-2 border-slate-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                maxLength={20}
                autoComplete="off"
              />
              <p className="text-xs text-slate-500 mt-1">{username.length}/20 characters</p>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Password</label>
              <Input
                type="password"
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full text-sm sm:text-base py-2 sm:py-3 px-3 border-2 border-slate-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              {!isLogin && password && (
                <div className="text-xs text-slate-600 mt-2 space-y-1">
                  <p className={password.length >= 6 ? 'text-green-600' : 'text-slate-500'}>
                    {password.length >= 6 ? '✓' : '•'} At least 6 characters
                  </p>
                  <p className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-slate-500'}>
                    {/[A-Z]/.test(password) ? '✓' : '•'} One uppercase letter
                  </p>
                  <p className={/[0-9]/.test(password) ? 'text-green-600' : 'text-slate-500'}>
                    {/[0-9]/.test(password) ? '✓' : '•'} One number
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field - Signup only */}
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full text-sm sm:text-base py-2 sm:py-3 px-3 border-2 border-slate-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                  autoComplete="new-password"
                />
                {confirmPassword && (
                  <p className={password === confirmPassword ? 'text-green-600 text-xs mt-1' : 'text-red-600 text-xs mt-1'}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            )}

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
              {loading ? 'Securing access...' : isLogin ? 'Login' : 'Create Account'}
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
            Your account is secure and progress saved to the cloud
          </p>
        </div>
      </div>
    </div>
  )
}
