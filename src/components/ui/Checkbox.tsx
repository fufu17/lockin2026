'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, checked, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn('flex items-center gap-3 cursor-pointer group', className)}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 rounded-md border transition-all duration-200',
              checked
                ? 'bg-accent border-accent'
                : 'border-white/20 group-hover:border-white/40'
            )}
          >
            {checked && (
              <Check className="w-5 h-5 text-white p-0.5" strokeWidth={3} />
            )}
          </div>
        </div>
        {label && (
          <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
            {label}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
