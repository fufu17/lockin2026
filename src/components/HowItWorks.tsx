'use client'

import { Play, Timer, Trophy } from 'lucide-react'

const STEPS = [
  {
    icon: Play,
    title: 'Start a lock-in session',
    description: 'Pick your mode, set your duration, and define what you will accomplish.',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: Timer,
    title: 'Focus until the timer ends',
    description: 'Stay locked in with a distraction-free countdown. No excuses.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Trophy,
    title: 'Log your wins',
    description: 'Rate your focus, save your session, and keep your streak going.',
    color: 'bg-amber-100 text-amber-600',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Three simple steps to deep focus and real results.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector line (desktop) */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-card-border" />
              )}

              <div className="card p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="text-accent hover:text-accent-hover transition-colors font-medium"
          >
            Ready to start? Go back to the top
          </a>
        </div>
      </div>
    </section>
  )
}
