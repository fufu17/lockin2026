'use client'

import { cn } from '@/lib/utils'
import { CommitmentStatus } from '@/types/database'

interface BadgeProps {
  status: CommitmentStatus
  className?: string
}

export function Badge({ status, className }: BadgeProps) {
  const variants = {
    in_progress: 'badge-progress',
    completed: 'badge-completed',
    expired: 'badge-expired',
  }

  const labels = {
    in_progress: 'In Progress',
    completed: 'Completed',
    expired: 'Expired',
  }

  return (
    <span className={cn('badge', variants[status], className)}>
      {status === 'in_progress' && (
        <span className="w-1.5 h-1.5 rounded-full bg-current pulse" />
      )}
      {labels[status]}
    </span>
  )
}
