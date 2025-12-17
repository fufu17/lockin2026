import { formatDistanceToNow } from 'date-fns'
import { CommitmentStatus } from '@/types/database'

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMins = minutes % 60
  if (remainingMins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remainingMins}m`
}

export function formatTimerDisplay(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function getCommitmentStatus(
  createdAt: string,
  durationMinutes: number,
  currentStatus: CommitmentStatus
): CommitmentStatus {
  if (currentStatus === 'completed') return 'completed'

  const startTime = new Date(createdAt).getTime()
  const endTime = startTime + durationMinutes * 60 * 1000
  const now = Date.now()

  if (now >= endTime) {
    return 'expired'
  }

  return 'in_progress'
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function generateAvatarColor(name: string): string {
  const colors = [
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-orange-500',
    'bg-red-500',
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

export function getModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    study: 'Study',
    build: 'Build / Startup',
    content: 'Content',
    gym: 'Gym',
    deep_work: 'Deep Work',
  }
  return labels[mode] || mode
}

export function getModeEmoji(mode: string): string {
  const emojis: Record<string, string> = {
    study: '',
    build: '',
    content: '',
    gym: '',
    deep_work: '',
  }
  return emojis[mode] || ''
}
