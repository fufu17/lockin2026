'use client'

import { useState, useEffect } from 'react'
import { useSupabase, useStorageMode } from '@/hooks/useSupabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { Commitment, CommitmentFormData } from '@/types/database'
import { getStoredCommitments, saveCommitment } from '@/lib/localStorage'
import { CommitmentCard } from './CommitmentCard'
import { CommitmentForm } from './CommitmentForm'

// Seed data for development
const SEED_COMMITMENTS: Commitment[] = [
  {
    id: 'seed-1',
    alias: 'Alex Chen',
    goal: 'Complete React tutorial and build first component',
    duration_minutes: 50,
    status: 'in_progress',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'seed-2',
    alias: 'Jordan K',
    goal: 'Write blog post about productivity systems',
    duration_minutes: 90,
    status: 'completed',
    created_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'seed-3',
    alias: 'Sam W',
    goal: 'Gym: Push day - chest, shoulders, triceps',
    duration_minutes: 60,
    status: 'in_progress',
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'seed-4',
    alias: 'Taylor M',
    goal: 'Study for AWS certification exam',
    duration_minutes: 25,
    status: 'completed',
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    session_id: null,
  },
  {
    id: 'seed-5',
    alias: 'Riley P',
    goal: 'Edit 3 TikTok videos for client',
    duration_minutes: 50,
    status: 'in_progress',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    session_id: null,
  },
]

export function CommitmentWall() {
  const supabase = useSupabase()
  const { isLocal } = useStorageMode()
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [useSeedData, setUseSeedData] = useState(false)

  useEffect(() => {
    fetchCommitments()

    // Only subscribe to realtime if using Supabase
    if (!isLocal) {
      const cleanup = subscribeToCommitments()
      return cleanup
    }
  }, [isLocal])

  const fetchCommitments = async () => {
    setIsLoading(true)

    if (isLocal) {
      // Use localStorage
      const localCommitments = getStoredCommitments()
      if (localCommitments.length > 0) {
        setCommitments(localCommitments)
        setUseSeedData(false)
      } else {
        setUseSeedData(true)
        setCommitments(SEED_COMMITMENTS)
      }
      setIsLoading(false)
      return
    }

    // Use Supabase
    const { data, error } = await supabase
      .from('commitments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching commitments:', error)
      // Fallback to localStorage
      const localCommitments = getStoredCommitments()
      if (localCommitments.length > 0) {
        setCommitments(localCommitments)
      } else {
        setUseSeedData(true)
        setCommitments(SEED_COMMITMENTS)
      }
    } else {
      setCommitments(data || [])
      setUseSeedData(data?.length === 0)
    }
    setIsLoading(false)
  }

  const subscribeToCommitments = () => {
    const channel = supabase
      .channel('commitments-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'commitments',
        },
        (payload: RealtimePostgresChangesPayload<Commitment>) => {
          const newCommitment = payload.new as Commitment
          setCommitments((prev) => [newCommitment, ...prev])
          setUseSeedData(false)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'commitments',
        },
        (payload: RealtimePostgresChangesPayload<Commitment>) => {
          const updatedCommitment = payload.new as Commitment
          setCommitments((prev) =>
            prev.map((c) =>
              c.id === updatedCommitment.id ? updatedCommitment : c
            )
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

    if (isLocal || useSeedData) {
      // Save to localStorage
      const localCommitment = saveCommitment(newCommitmentData)
      setCommitments((prev) => [localCommitment, ...prev])
      setUseSeedData(false)
      return localCommitment
    }

    // Save to Supabase
    const { data: insertedData, error } = await supabase
      .from('commitments')
      .insert(newCommitmentData)
      .select()
      .single()

    if (error) {
      console.error('Error creating commitment:', error)
      // Fallback to localStorage
      const localCommitment = saveCommitment(newCommitmentData)
      setCommitments((prev) => [localCommitment, ...prev])
      return localCommitment
    }

    return insertedData
  }

  // Display seed data if no real data exists
  const displayCommitments = commitments.length > 0 ? commitments : (useSeedData ? SEED_COMMITMENTS : [])

  return (
    <section id="wall" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            The Lock-In Wall
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            See what others are committing to—and add your own.
          </p>
        </div>

        {/* Commitment Form */}
        <div className="mb-12">
          <CommitmentForm onSubmit={handleNewCommitment} />
        </div>

        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse" />
          <span className="text-sm text-muted">
            {isLocal ? 'Local mode' : 'Live updates'}
          </span>
        </div>

        {/* Commitments Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="card p-6 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-surface rounded w-1/3" />
                    <div className="h-4 bg-surface rounded w-full" />
                    <div className="h-4 bg-surface rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayCommitments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted">
              No commitments yet. Be the first to lock in!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCommitments.map((commitment, index) => (
              <CommitmentCard
                key={commitment.id}
                commitment={commitment}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
