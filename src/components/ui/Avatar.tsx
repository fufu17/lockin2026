'use client'

import { cn, getInitials, generateAvatarColor } from '@/lib/utils'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name)
  const colorClass = generateAvatarColor(name)

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white',
        colorClass,
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
