'use client'

import { useState } from 'react'
import { Play, Clock, Target } from 'lucide-react'
import { Button } from './ui/Button'
import { LockInModal } from './LockInModal'
import { TimerIllustration } from './illustrations'

export function Hero() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <section className="min-h-screen pt-24 pb-16 flex items-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light border border-accent/20 text-accent text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent pulse" />
                  Ready to lock in
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Lock In 2026
                  <br />
                  <span className="text-accent">
                    Starts Today.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-muted max-w-lg">
                  Pick a goal. Set a timer. Prove you did the work.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={() => setShowModal(true)}
                  className="group"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Start My Lock-In Session
                </Button>

                <p className="text-sm text-muted-light">
                  No friction. No fluff. Just focus.
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">3 Steps</p>
                    <p className="text-sm text-muted-light">To lock in</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">100% Focus</p>
                    <p className="text-sm text-muted-light">Zero distractions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Illustration */}
            <div className="relative flex items-center justify-center">
              <TimerIllustration className="w-full max-w-md" />
            </div>
          </div>
        </div>
      </section>

      <LockInModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
