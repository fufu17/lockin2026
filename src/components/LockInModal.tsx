'use client'

import { useState } from 'react'
import { SessionMode, SessionFormData } from '@/types/database'

interface LockInModalProps {
  isOpen: boolean
  onClose: () => void
}

const MODES: { value: SessionMode; label: string }[] = [
  { value: 'study', label: 'Study' },
  { value: 'build', label: 'Build' },
  { value: 'content', label: 'Content' },
  { value: 'gym', label: 'Gym' },
  { value: 'deep_work', label: 'Deep Work' },
]

const DURATION_PRESETS = [25, 50, 90]

export function LockInModal({ isOpen, onClose }: LockInModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<SessionFormData>({
    mode: 'deep_work',
    duration: 25,
    goal: '',
  })
  const [customDuration, setCustomDuration] = useState('')

  const handleModeSelect = (mode: SessionMode) => {
    setFormData((prev) => ({ ...prev, mode }))
    setStep(2)
  }

  const handleDurationSelect = (duration: number) => {
    setFormData((prev) => ({ ...prev, duration }))
    setCustomDuration('')
    setStep(3)
  }

  const handleCustomDuration = (value: string) => {
    setCustomDuration(value)
    const parsed = parseInt(value, 10)
    if (!isNaN(parsed) && parsed > 0 && parsed <= 480) {
      setFormData((prev) => ({ ...prev, duration: parsed }))
    }
  }

  const handleStartSession = () => {
    if (!formData.goal.trim()) return

    localStorage.setItem('pendingSession', JSON.stringify(formData))
    window.location.href = '/focus'
  }

  const handleClose = () => {
    setStep(1)
    setFormData({ mode: 'deep_work', duration: 25, goal: '' })
    setCustomDuration('')
    onClose()
  }

  if (!isOpen) return null

  const selectedMode = MODES.find((m) => m.value === formData.mode)

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-xl slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Start Session</h2>
              <p className="text-sm text-neutral-500">Step {step} of 3</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {step === 1 && (
            <div className="space-y-4 fade-in">
              <p className="text-sm text-neutral-500">What type of work?</p>

              <div className="grid grid-cols-2 gap-2">
                {MODES.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => handleModeSelect(mode.value)}
                    className={`p-4 text-left rounded-lg border transition-colors ${
                      formData.mode === mode.value
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="text-sm font-medium text-neutral-900">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 fade-in">
              <p className="text-sm text-neutral-500">How long?</p>

              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => handleDurationSelect(duration)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      formData.duration === duration && !customDuration
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-400">or</span>
                <input
                  type="number"
                  placeholder="Custom (1-480)"
                  value={customDuration}
                  onChange={(e) => handleCustomDuration(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
                  min={1}
                  max={480}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customDuration) {
                      setStep(3)
                    }
                  }}
                />
              </div>

              {customDuration && (
                <button
                  onClick={() => setStep(3)}
                  disabled={parseInt(customDuration) < 1 || parseInt(customDuration) > 480}
                  className="w-full py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  Continue with {customDuration} min
                </button>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 fade-in">
              <p className="text-sm text-neutral-500">What will you accomplish?</p>

              <input
                type="text"
                placeholder="Be specific about your goal..."
                value={formData.goal}
                onChange={(e) => setFormData((prev) => ({ ...prev, goal: e.target.value }))}
                className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
                autoFocus
              />

              {/* Summary */}
              <div className="p-4 bg-neutral-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Mode</span>
                  <span className="text-neutral-900 font-medium">{selectedMode?.label}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Duration</span>
                  <span className="text-neutral-900 font-medium">{formData.duration} min</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="flex-1 py-2.5 text-sm font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Back
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleStartSession}
              disabled={!formData.goal.trim()}
              className="flex-1 py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Session
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
