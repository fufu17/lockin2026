'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useStorageMode } from '@/hooks/useSupabase'
import { useSupabase } from '@/hooks/useSupabase'
import { getModeLabel } from '@/lib/utils'
import { saveSession } from '@/lib/localStorage'
import { AuthModal } from './AuthModal'

interface SessionCompleteProps {
  mode: string
  goal: string
  targetMinutes: number
  actualMinutes: number
}

export function SessionComplete({
  mode,
  goal,
  targetMinutes,
  actualMinutes,
}: SessionCompleteProps) {
  const router = useRouter()
  const { user } = useUser()
  const supabase = useSupabase()
  const { isLocal } = useStorageMode()
  const [focusRating, setFocusRating] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveSession = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setIsSaving(true)

    const sessionData = {
      user_id: user.id,
      mode,
      goal,
      duration_minutes: targetMinutes,
      started_at: new Date(Date.now() - actualMinutes * 60000).toISOString(),
      ended_at: new Date().toISOString(),
      focus_rating: focusRating || null,
    }

    if (isLocal) {
      saveSession(sessionData)
      setSaved(true)
      setIsSaving(false)
    } else {
      const { error } = await supabase.from('sessions').insert(sessionData)

      setIsSaving(false)

      if (error) {
        console.error('Error saving session:', error)
        saveSession(sessionData)
        setSaved(true)
      } else {
        setSaved(true)
      }
    }
  }

  const handleBackHome = () => {
    router.push('/')
  }

  const completionPercent = Math.min(100, Math.round((actualMinutes / targetMinutes) * 100))

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 justify-center">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="font-mono text-xs text-gray-500">MISSION COMPLETE</span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Success message */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 font-mono font-bold text-xl mb-4">
                {completionPercent}%
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                OBJECTIVE ACHIEVED
              </h2>
              <p className="font-mono text-sm text-gray-500">
                Mission successfully executed.
              </p>
            </div>

            {/* Stats */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="font-mono text-2xl font-bold text-gray-900">{actualMinutes}</p>
                  <p className="font-mono text-xs text-gray-500 mt-1">MIN FOCUSED</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="font-mono text-2xl font-bold text-gray-900">{targetMinutes}</p>
                  <p className="font-mono text-xs text-gray-500 mt-1">MIN TARGET</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500">MODE</span>
                  <span className="font-mono text-sm font-medium">{getModeLabel(mode).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500">OBJECTIVE</span>
                  <span className="font-mono text-sm font-medium text-right max-w-[200px] truncate">
                    {goal}
                  </span>
                </div>
              </div>
            </div>

            {/* Focus rating */}
            <div className="mb-6">
              <p className="font-mono text-xs text-gray-500 text-center mb-3">
                INTENSITY RATING
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFocusRating(rating)}
                    className={`w-10 h-10 rounded-lg font-mono text-sm font-medium transition-all ${
                      focusRating >= rating
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {saved ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="font-mono text-sm text-green-700">LOG SAVED TO LEDGER</p>
                </div>
              ) : (
                <button
                  onClick={handleSaveSession}
                  disabled={isSaving}
                  className="w-full py-3 bg-gray-900 text-white font-mono text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'SAVING...' : user ? 'SAVE TO LEDGER →' : 'AUTHENTICATE TO SAVE →'}
                </button>
              )}
              <button
                onClick={handleBackHome}
                className="w-full py-3 border border-gray-200 font-mono text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                RETURN TO BASE
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
