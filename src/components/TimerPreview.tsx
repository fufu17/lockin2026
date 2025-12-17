'use client'

import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'

export function TimerPreview() {
  const [time, setTime] = useState({ minutes: 25, seconds: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        }
        return { minutes: 25, seconds: 0 }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative glass-card p-6 sm:p-8 glow-accent">
      {/* Phone frame mockup */}
      <div className="relative mx-auto max-w-[280px]">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />

        {/* Screen */}
        <div className="bg-gradient-to-b from-[#0f0f18] to-[#0a0a0f] rounded-[2rem] p-4 pt-10 pb-6 border border-white/10">
          {/* Status bar */}
          <div className="flex items-center justify-between px-2 mb-6 text-white/40 text-xs">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white/40 rounded-sm">
                <div className="w-2.5 h-full bg-green-400 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Mode indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lock className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Deep Work
            </span>
          </div>

          {/* Timer display */}
          <div className="relative flex items-center justify-center mb-6">
            {/* Outer ring */}
            <div className="absolute w-44 h-44 rounded-full border-2 border-accent/20" />

            {/* Progress ring */}
            <svg className="absolute w-44 h-44 -rotate-90" viewBox="0 0 176 176">
              <circle
                cx="88"
                cy="88"
                r="84"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-accent"
                strokeDasharray={528}
                strokeDashoffset={528 * (1 - (time.minutes * 60 + time.seconds) / 1500)}
                strokeLinecap="round"
              />
            </svg>

            {/* Time display */}
            <div className="text-center">
              <p className="text-4xl font-bold text-white font-mono">
                {time.minutes.toString().padStart(2, '0')}:
                {time.seconds.toString().padStart(2, '0')}
              </p>
              <p className="text-xs text-white/40 mt-1">remaining</p>
            </div>
          </div>

          {/* Goal */}
          <div className="text-center px-4">
            <p className="text-sm text-white/80 line-clamp-2">
              Complete project proposal draft
            </p>
          </div>

          {/* Bottom indicator */}
          <div className="flex justify-center mt-6">
            <div className="w-32 h-1 bg-white/10 rounded-full">
              <div className="w-1/2 h-full bg-accent rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
        LIVE
      </div>
    </div>
  )
}
