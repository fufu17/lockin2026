'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { CommitmentFormData } from '@/types/database'
import { Input } from './ui/Input'
import { Pill } from './ui/Pill'
import { Checkbox } from './ui/Checkbox'
import { Button } from './ui/Button'

interface CommitmentFormProps {
  onSubmit: (data: CommitmentFormData) => Promise<unknown>
}

const DURATION_PRESETS = [25, 50, 90]

export function CommitmentForm({ onSubmit }: CommitmentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alias, setAlias] = useState('')
  const [goal, setGoal] = useState('')
  const [duration, setDuration] = useState(25)
  const [customDuration, setCustomDuration] = useState('')
  const [startTimer, setStartTimer] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!alias.trim() || !goal.trim()) return

    setIsSubmitting(true)

    const data: CommitmentFormData = {
      alias: alias.trim(),
      goal: goal.trim(),
      duration: customDuration ? parseInt(customDuration, 10) : duration,
      startTimer,
    }

    await onSubmit(data)

    // If starting timer, save session data and navigate
    if (startTimer) {
      localStorage.setItem(
        'pendingSession',
        JSON.stringify({
          mode: 'deep_work',
          duration: data.duration,
          goal: data.goal,
        })
      )
      router.push('/focus')
    } else {
      // Reset form
      setAlias('')
      setGoal('')
      setDuration(25)
      setCustomDuration('')
      setStartTimer(false)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-2xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Input
          placeholder="Your name or alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          required
        />
        <Input
          placeholder="What are you locking in on?"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-sm text-muted">Duration:</span>
        {DURATION_PRESETS.map((d) => (
          <Pill
            key={d}
            active={duration === d && !customDuration}
            onClick={() => {
              setDuration(d)
              setCustomDuration('')
            }}
            type="button"
          >
            {d} min
          </Pill>
        ))}
        <input
          type="number"
          placeholder="Custom"
          value={customDuration}
          onChange={(e) => setCustomDuration(e.target.value)}
          className="w-20 px-3 py-2 rounded-full bg-surface border border-card-border text-foreground text-sm text-center focus:outline-none focus:border-accent"
          min={1}
          max={480}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Checkbox
          id="startTimer"
          label="Start timer right after posting"
          checked={startTimer}
          onChange={(e) => setStartTimer(e.target.checked)}
        />

        <Button type="submit" isLoading={isSubmitting}>
          <Lock className="w-4 h-4" />
          Lock Me In
        </Button>
      </div>
    </form>
  )
}
