'use client'

import { useState } from 'react'
import { useAuth, useStorageMode } from '@/hooks/useSupabase'
import { Modal } from './ui/Modal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const { signIn, loading: isLoading } = useAuth()
  const { isLocal } = useStorageMode()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const result = await signIn(email)

    if (!result.success && result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success && !isLocal) {
      setMessage({
        type: 'success',
        text: 'Check your email for the magic link!',
      })
    }
  }

  const handleClose = () => {
    setEmail('')
    setMessage(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-neutral-500">
          {isLocal
            ? 'Enter your email to create a local account.'
            : 'Enter your email to receive a magic link.'}
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
        />

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 text-sm font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : isLocal ? 'Create Account' : 'Send Link'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
