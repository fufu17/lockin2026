'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase, useStorageMode } from '@/hooks/useSupabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { Commitment, CommitmentFormData } from '@/types/database'
import { getStoredCommitments, saveCommitment } from '@/lib/localStorage'
import { formatRelativeTime, formatDuration, getCommitmentStatus } from '@/lib/utils'

const SEED_COMMITMENTS: Commitment[] = [
  {
    id: 'init-1',
    alias: 'DAVIS',
    goal: 'Run a sub-20 minute 5K by November 30th. Training block starts 0500 tomorrow.',
    duration_minutes: 50,
    status: 'in_progress',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-2',
    alias: 'SARAH_DEV',
    goal: 'Ship the MVP for the SaaS project before the end of Q3. No distractions, no feature creep.',
    duration_minutes: 90,
    status: 'in_progress',
    created_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-3',
    alias: 'ALEX',
    goal: 'Read 12 books on stoicism and finance by year end. Daily reading habit: 30 pages min.',
    duration_minutes: 60,
    status: 'in_progress',
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-4',
    alias: 'MIKE_FIT',
    goal: 'Lose 20 lbs by March. Strict diet, no cheat meals. Gym 6 days a week.',
    duration_minutes: 45,
    status: 'in_progress',
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-5',
    alias: 'JENNY',
    goal: 'Complete AWS Solutions Architect certification. Study 2 hours daily until exam.',
    duration_minutes: 120,
    status: 'completed',
    created_at: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-6',
    alias: 'CARLOS',
    goal: 'Launch my YouTube channel with 10 videos by end of month. No excuses.',
    duration_minutes: 180,
    status: 'in_progress',
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-7',
    alias: 'PRIYA',
    goal: 'Meditate every morning for 30 days straight. Building the habit starts now.',
    duration_minutes: 30,
    status: 'in_progress',
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-8',
    alias: 'JAKE_CODE',
    goal: 'Finish the React course and build 3 portfolio projects. Job hunt starts in 60 days.',
    duration_minutes: 90,
    status: 'in_progress',
    created_at: new Date(Date.now() - 55 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-9',
    alias: 'EMMA',
    goal: 'Write 1000 words daily for my novel. First draft done by February.',
    duration_minutes: 60,
    status: 'completed',
    created_at: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-10',
    alias: 'TONY_BIZ',
    goal: 'Cold call 50 prospects this week. Revenue targets are non-negotiable.',
    duration_minutes: 120,
    status: 'in_progress',
    created_at: new Date(Date.now() - 35 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-11',
    alias: 'LISA',
    goal: 'Practice piano 1 hour daily. Recital in 3 months, no missed days.',
    duration_minutes: 60,
    status: 'in_progress',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'init-12',
    alias: 'OMAR',
    goal: 'No social media for 30 days. Reclaim my focus and mental clarity.',
    duration_minutes: 43200,
    status: 'in_progress',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    session_id: null,
  },
]

function InitiateLockInForm({ onSubmit }: { onSubmit: (data: CommitmentFormData) => Promise<void> }) {
  const router = useRouter()
  const [alias, setAlias] = useState('')
  const [goal, setGoal] = useState('')
  const [aiOptimization, setAiOptimization] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!alias.trim() || !goal.trim()) return

    setIsSubmitting(true)
    await onSubmit({
      alias: alias.trim().toUpperCase(),
      goal: goal.trim(),
      duration: 60,
      startTimer: true,
    })

    localStorage.setItem('pendingSession', JSON.stringify({
      mode: 'deep_work',
      duration: 60,
      goal: goal.trim(),
    }))
    router.push('/focus')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="border border-gray-200 rounded-lg p-6 sm:p-8 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1 h-5 bg-blue-600" />
          <h2 className="font-mono font-bold text-sm tracking-wide">INITIATE_LOCK_IN</h2>
        </div>

        <div className="mb-5">
          <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
            Your Name
          </label>
          <input
            type="text"
            placeholder="CALLSIGN / NAME"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full px-4 py-3 font-mono text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
            Mission Objective
          </label>
          <textarea
            placeholder="Describe your goal. Vague inputs will be refined by protocol AI."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 font-mono text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 resize-none"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAiOptimization(!aiOptimization)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                aiOptimization ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  aiOptimization ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <p className="font-mono text-xs font-medium">AI_OPTIMIZATION</p>
              <p className="font-mono text-xs text-gray-400">Smart contracts & intensity scoring</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !alias.trim() || !goal.trim()}
            className="px-6 py-3 bg-gray-900 text-white font-mono text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            LOCK IN
            <span>→</span>
          </button>
        </div>
      </div>
    </form>
  )
}

function CommitmentDialog({ commitment, onClose }: { commitment: Commitment; onClose: () => void }) {
  const status = getCommitmentStatus(
    commitment.created_at,
    commitment.duration_minutes,
    commitment.status
  )
  const isLocked = status === 'in_progress'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-lg shadow-xl slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${isLocked ? 'bg-blue-500' : 'bg-green-500'}`} />
              <span className="font-mono font-bold">{commitment.alias}</span>
              <span className="font-mono text-xs text-gray-400">ID: {commitment.id}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium ${
              isLocked
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-green-50 text-green-600 border border-green-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-blue-500' : 'bg-green-500'}`} />
              {isLocked ? 'LOCKED' : 'COMPLETE'}
            </span>
          </div>

          {/* Mission Objective */}
          <div className="mb-6">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
              Mission Objective
            </p>
            <p className="text-gray-900 font-medium leading-relaxed">
              {commitment.goal}
            </p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-mono text-xs text-gray-500 mb-1">DURATION</p>
              <p className="font-mono font-bold">{formatDuration(commitment.duration_minutes)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-mono text-xs text-gray-500 mb-1">INITIATED</p>
              <p className="font-mono font-bold">{formatRelativeTime(commitment.created_at)}</p>
            </div>
          </div>

          {/* Origin */}
          <div className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
            <p className="font-mono text-xs text-gray-500 mb-1">ORIGIN_HASH</p>
            <p className="font-mono text-sm text-gray-600">
              &quot;{commitment.goal.split(' ').slice(0, 5).join(' ').toLowerCase()}...&quot;
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="w-full py-3 border border-gray-200 font-mono text-sm font-medium rounded-lg hover:bg-white transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}

function CommitmentCard({ commitment, onClick }: { commitment: Commitment; onClick: () => void }) {
  const status = getCommitmentStatus(
    commitment.created_at,
    commitment.duration_minutes,
    commitment.status
  )

  const isLocked = status === 'in_progress'

  return (
    <div
      onClick={onClick}
      className="p-5 border border-gray-200 rounded-lg bg-white card-hover cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm">{commitment.alias}</span>
          <span className="font-mono text-xs text-gray-400">| ID: {commitment.id}</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium ${
          isLocked
            ? 'bg-blue-50 text-blue-600 border border-blue-200'
            : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-blue-500' : 'bg-green-500'}`} />
          {isLocked ? 'LOCKED' : 'COMPLETE'}
        </span>
      </div>

      {/* Goal */}
      <p className="text-gray-900 font-medium leading-relaxed mb-3">
        {commitment.goal}
      </p>

      {/* Origin */}
      <p className="font-mono text-xs text-gray-400">
        | &quot;Origin: {commitment.goal.split(' ').slice(0, 3).join(' ').toLowerCase()}&quot;
      </p>
    </div>
  )
}

export function LockInWall() {
  const supabase = useSupabase()
  const { isLocal } = useStorageMode()
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null)

  useEffect(() => {
    fetchCommitments()

    if (!isLocal) {
      const cleanup = subscribeToCommitments()
      return cleanup
    }
  }, [isLocal])

  const fetchCommitments = async () => {
    setIsLoading(true)

    if (isLocal) {
      const localCommitments = getStoredCommitments()
      setCommitments(localCommitments.length > 0 ? localCommitments : SEED_COMMITMENTS)
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('commitments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching commitments:', error)
      const localCommitments = getStoredCommitments()
      setCommitments(localCommitments.length > 0 ? localCommitments : SEED_COMMITMENTS)
    } else {
      setCommitments(data?.length ? data : SEED_COMMITMENTS)
    }
    setIsLoading(false)
  }

  const subscribeToCommitments = () => {
    const channel = supabase
      .channel('commitments-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'commitments' },
        (payload: RealtimePostgresChangesPayload<Commitment>) => {
          const newCommitment = payload.new as Commitment
          setCommitments((prev) => [newCommitment, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'commitments' },
        (payload: RealtimePostgresChangesPayload<Commitment>) => {
          const updatedCommitment = payload.new as Commitment
          setCommitments((prev) =>
            prev.map((c) => (c.id === updatedCommitment.id ? updatedCommitment : c))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleNewCommitment = async (data: CommitmentFormData) => {
    const newCommitmentData = {
      alias: data.alias,
      goal: data.goal,
      duration_minutes: data.duration,
      status: 'in_progress' as const,
      created_at: new Date().toISOString(),
      session_id: null,
    }

    if (isLocal) {
      const localCommitment = saveCommitment(newCommitmentData)
      setCommitments((prev) => [localCommitment, ...prev.filter(c => !c.id.startsWith('init-'))])
      return
    }

    const { error } = await supabase
      .from('commitments')
      .insert(newCommitmentData)
      .select()
      .single()

    if (error) {
      const localCommitment = saveCommitment(newCommitmentData)
      setCommitments((prev) => [localCommitment, ...prev])
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Lock In Form */}
      <InitiateLockInForm onSubmit={handleNewCommitment} />

      {/* Live Feed Section */}
      <div className="mt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
              PUBLIC POSTS
            </span>
            <span className="w-full max-w-[200px] h-px bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-mono text-xs text-gray-500">REAL-TIME</span>
          </div>
        </div>

        {/* Commitments Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-5 border border-gray-100 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
                <div className="h-16 bg-gray-50 rounded mb-3" />
                <div className="h-3 bg-gray-50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {commitments.map((commitment) => (
              <CommitmentCard
                key={commitment.id}
                commitment={commitment}
                onClick={() => setSelectedCommitment(commitment)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      {selectedCommitment && (
        <CommitmentDialog
          commitment={selectedCommitment}
          onClose={() => setSelectedCommitment(null)}
        />
      )}
    </div>
  )
}
