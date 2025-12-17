'use client'

import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Pill({ className, active, children, ...props }: PillProps) {
  return (
    <button
      className={cn('pill', active && 'active', className)}
      {...props}
    >
      {children}
    </button>
  )
}
