'use client'

import { CSSProperties, useMemo } from 'react'
import { Clock } from 'lucide-react'
import { Commitment } from '@/types/database'
import { formatRelativeTime, formatDuration, getCommitmentStatus } from '@/lib/utils'
import { Avatar } from './ui/Avatar'
import { Badge } from './ui/Badge'

interface CommitmentCardProps {
  commitment: Commitment
  style?: CSSProperties
}

export function CommitmentCard({ commitment, style }: CommitmentCardProps) {
  const status = useMemo(
    () =>
      getCommitmentStatus(
        commitment.created_at,
        commitment.duration_minutes,
        commitment.status
      ),
    [commitment.created_at, commitment.duration_minutes, commitment.status]
  )

  return (
    <div
      className="card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 fade-in"
      style={style}
    >
      <div className="flex items-start gap-4">
        <Avatar name={commitment.alias} />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground truncate">
              {commitment.alias}
            </h3>
            <Badge status={status} />
          </div>

          {/* Goal */}
          <p className="text-muted text-sm mb-3 line-clamp-2">
            {commitment.goal}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-light">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(commitment.duration_minutes)}</span>
            </div>
            <span>Locked in {formatRelativeTime(commitment.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
