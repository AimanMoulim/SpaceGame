'use client'

import React from "react"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PlatformSettingsProps {
  userId: string
  username: string
  onLogout: () => void
}

export function PlatformSettings({ userId, username, onLogout }: PlatformSettingsProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'security'>('account')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setLoading(true)
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        {['account', 'preferences', 'security'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any)
              setMessage(null)
            }}
            className={`px-6 py-3 font-semibold border-b-2 transition-all ${
              activeTab === tab
                ? 'border-yellow-500 text-yellow-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab === 'account' && '👤 Account'}
            {tab === 'preferences' && '⚙️ Preferences'}
            {tab === 'security' && '🔒 Security'}
          </button>
        ))}
      </div>

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
            <Input
              type="text"
              value={username}
              disabled
              className="bg-slate-800 border-slate-700 text-slate-400"
            />
            <p className="text-xs text-slate-500 mt-2">Username cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Account Type</label>
            <Input
              type="text"
              value="Premium Player"
              disabled
              className="bg-slate-800 border-slate-700 text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Account Created</label>
            <Input
              type="text"
              value={new Date().toLocaleDateString()}
              disabled
              className="bg-slate-800 border-slate-700 text-slate-400"
            />
          </div>

          <div className="pt-4 border-t border-slate-700">
            <Button
              onClick={onLogout}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Logout from All Devices
            </Button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <div>
              <h3 className="font-semibold text-white">Sound Effects</h3>
              <p className="text-sm text-slate-400">Enable game sound effects</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  soundEnabled ? 'bg-green-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <div>
              <h3 className="font-semibold text-white">Notifications</h3>
              <p className="text-sm text-slate-400">Receive game updates and alerts</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-green-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h4 className="font-semibold text-blue-300 mb-2">Display Settings</h4>
            <p className="text-sm text-blue-200">Additional display options coming soon</p>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6">Change Password</h2>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                  : 'bg-red-500/20 border border-red-500/50 text-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (minimum 6 characters)"
                className="bg-slate-800 border-slate-700"
                required
              />
              <div className="mt-2 text-xs space-y-1">
                <p className={newPassword.length >= 6 ? 'text-green-400' : 'text-slate-500'}>
                  {newPassword.length >= 6 ? '✓' : '•'} At least 6 characters
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-slate-800 border-slate-700"
                required
              />
              {confirmPassword && (
                <p className={`mt-2 text-xs ${newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                  {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-lg font-bold mb-4 text-red-400">Danger Zone</h3>
            <Button className="w-full px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/50 text-red-400 font-semibold rounded-lg transition-colors">
              Delete Account
            </Button>
            <p className="text-xs text-slate-500 mt-2">This action cannot be undone</p>
          </div>
        </div>
      )}
    </div>
  )
}
