'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SessionFormData } from '@/types/database'
import { useTimer } from '@/hooks/useTimer'
import { formatTimerDisplay, getModeLabel } from '@/lib/utils'
import { SessionComplete } from './SessionComplete'

export function FocusSession() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionFormData | null>(null)
  const [showComplete, setShowComplete] = useState(false)
  const [actualMinutes, setActualMinutes] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)

  useEffect(() => {
    const pending = localStorage.getItem('pendingSession')
    if (pending) {
      const data = JSON.parse(pending) as SessionFormData
      setSessionData(data)
      setSessionStartTime(new Date())
      localStorage.removeItem('pendingSession')
    } else {
      router.push('/')
    }
  }, [router])

  const handleSessionComplete = useCallback(() => {
    if (sessionStartTime) {
      const elapsed = Math.round((Date.now() - sessionStartTime.getTime()) / 60000)
      setActualMinutes(elapsed)
    }
    setShowComplete(true)
  }, [sessionStartTime])

  const { secondsRemaining, isRunning, start } = useTimer({
    initialSeconds: sessionData ? sessionData.duration * 60 : 0,
    onComplete: handleSessionComplete,
    autoStart: false,
  })

  useEffect(() => {
    if (sessionData && !isRunning) {
      start()
    }
  }, [sessionData, isRunning, start])

  const handleEndSession = () => {
    if (sessionStartTime) {
      const elapsed = Math.round((Date.now() - sessionStartTime.getTime()) / 60000)
      setActualMinutes(elapsed || 1)
    }
    setShowComplete(true)
  }

  const handleAbort = () => {
    if (confirm('ABORT MISSION? All progress will be lost.')) {
      router.push('/')
    }
  }

  if (showComplete && sessionData) {
    return (
      <SessionComplete
        mode={sessionData.mode}
        goal={sessionData.goal}
        targetMinutes={sessionData.duration}
        actualMinutes={actualMinutes}
      />
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="font-mono text-gray-500 text-sm">INITIALIZING...</p>
      </div>
    )
  }

  const progress = 1 - secondsRemaining / (sessionData.duration * 60)
  const circumference = 2 * Math.PI * 140

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => router.push('/')}
          className="font-mono text-sm text-gray-400 hover:text-gray-900 transition-colors"
        >
          ← EXIT
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="font-mono text-xs text-gray-500">MISSION ACTIVE</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Status */}
        <div className="text-center mb-8">
          <p className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
            {getModeLabel(sessionData.mode)} // SECTOR ACTIVE
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 max-w-lg">
            {sessionData.goal}
          </h1>
        </div>

        {/* Timer */}
        <div className="relative mb-8">
          <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90" viewBox="0 0 300 300">
            {/* Background circle */}
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="4"
            />
            {/* Progress circle */}
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="#2563eb"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>

          {/* Timer display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-mono text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
              {formatTimerDisplay(secondsRemaining)}
            </p>
            <p className="font-mono text-xs text-gray-400 mt-2">TIME REMAINING</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm mb-8">
          <div className="flex items-center justify-between font-mono text-xs text-gray-400 mb-2">
            <span>PROGRESS</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleEndSession}
            className="px-8 py-3 bg-gray-900 text-white font-mono text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            COMPLETE MISSION →
          </button>

          <button
            onClick={handleAbort}
            className="font-mono text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            [ ABORT ]
          </button>
        </div>
      </div>
    </div>
  )
}
