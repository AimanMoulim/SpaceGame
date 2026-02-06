'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PlatformShellProps {
  userId: string
  username: string
  currentPage: 'dashboard' | 'games' | 'profile' | 'leaderboard' | 'settings'
  children: React.ReactNode
  onLogout: () => void
}

export function PlatformShell({
  userId,
  username,
  currentPage,
  children,
  onLogout
}: PlatformShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('treasureGameProgress')
    onLogout()
    router.push('/')
  }

  const handleNavigate = (page: string) => {
    router.push(`/platform/${page}`)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎮</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Gaming Space</h1>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/platform/dashboard" className="font-bold text-2xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Treasure Quest
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-1">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-300">{username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 text-sm font-medium transition-colors"
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 bg-slate-900 p-4 space-y-2">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
