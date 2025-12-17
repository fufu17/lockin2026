'use client'

import { Session, Commitment, CommitmentStatus } from '@/types/database'

// Keys for localStorage
const STORAGE_KEYS = {
  USER: 'lockin_user',
  SESSIONS: 'lockin_sessions',
  COMMITMENTS: 'lockin_commitments',
} as const

// Local user type (simpler than Supabase User)
export interface LocalUser {
  id: string
  email: string
  display_name: string
  avatar_color: string
  created_at: string
}

// Generate a unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Generate a random avatar color
function generateAvatarColor(): string {
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6']
  return colors[Math.floor(Math.random() * colors.length)]
}

// Check if we're in browser
function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

// User management
export function getStoredUser(): LocalUser | null {
  if (!isBrowser()) return null
  const stored = localStorage.getItem(STORAGE_KEYS.USER)
  return stored ? JSON.parse(stored) : null
}

export function createLocalUser(email: string, displayName?: string): LocalUser {
  const user: LocalUser = {
    id: generateId(),
    email,
    display_name: displayName || email.split('@')[0],
    avatar_color: generateAvatarColor(),
    created_at: new Date().toISOString(),
  }
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }
  return user
}

export function updateLocalUser(updates: Partial<LocalUser>): LocalUser | null {
  const user = getStoredUser()
  if (!user) return null
  const updated = { ...user, ...updates }
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated))
  }
  return updated
}

export function signOutLocalUser(): void {
  if (isBrowser()) {
    localStorage.removeItem(STORAGE_KEYS.USER)
  }
}

// Sessions management
export function getStoredSessions(): Session[] {
  if (!isBrowser()) return []
  const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS)
  return stored ? JSON.parse(stored) : []
}

export function saveSession(sessionData: Omit<Session, 'id' | 'created_at'>): Session {
  const sessions = getStoredSessions()
  const newSession: Session = {
    ...sessionData,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  sessions.unshift(newSession)
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions))
  }
  return newSession
}

export function getUserSessions(userId: string): Session[] {
  return getStoredSessions().filter(s => s.user_id === userId)
}

// Commitments management
export function getStoredCommitments(): Commitment[] {
  if (!isBrowser()) return []
  const stored = localStorage.getItem(STORAGE_KEYS.COMMITMENTS)
  return stored ? JSON.parse(stored) : []
}

export function saveCommitment(commitmentData: Omit<Commitment, 'id'>): Commitment {
  const commitments = getStoredCommitments()
  const newCommitment: Commitment = {
    ...commitmentData,
    id: generateId(),
  }
  commitments.unshift(newCommitment)
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.COMMITMENTS, JSON.stringify(commitments))
  }
  return newCommitment
}

export function updateCommitmentStatus(id: string, status: CommitmentStatus): Commitment | null {
  const commitments = getStoredCommitments()
  const index = commitments.findIndex(c => c.id === id)
  if (index === -1) return null

  commitments[index] = { ...commitments[index], status }
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.COMMITMENTS, JSON.stringify(commitments))
  }
  return commitments[index]
}

// Get user stats
export function getUserStats(userId: string) {
  const sessions = getUserSessions(userId)
  const totalMinutes = sessions.reduce((acc, s) => {
    const start = new Date(s.started_at).getTime()
    const end = s.ended_at ? new Date(s.ended_at).getTime() : Date.now()
    return acc + Math.round((end - start) / 60000)
  }, 0)

  // Calculate streak (consecutive days with sessions)
  const sessionDates = [...new Set(
    sessions.map(s => new Date(s.started_at).toDateString())
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let streak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  if (sessionDates[0] === today || sessionDates[0] === yesterday) {
    streak = 1
    for (let i = 1; i < sessionDates.length; i++) {
      const curr = new Date(sessionDates[i - 1]).getTime()
      const prev = new Date(sessionDates[i]).getTime()
      if (curr - prev <= 86400000) {
        streak++
      } else {
        break
      }
    }
  }

  return {
    totalSessions: sessions.length,
    totalMinutes,
    currentStreak: streak,
  }
}
