'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import {
  getStoredUser,
  createLocalUser,
  signOutLocalUser,
} from '@/lib/localStorage'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export function useSupabase() {
  const supabase = createClient()
  return supabase
}

// Unified user type that works with both Supabase and localStorage
export interface AppUser {
  id: string
  email: string | undefined
  display_name: string
  avatar_color: string
}

export function useUser() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured()) {
      // Use Supabase auth
      const supabase = createClient()

      const getUser = async () => {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        if (supabaseUser) {
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email,
            display_name: supabaseUser.user_metadata?.display_name || supabaseUser.email?.split('@')[0] || 'User',
            avatar_color: supabaseUser.user_metadata?.avatar_color || '#22c55e',
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }

      getUser()

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, session: Session | null) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User',
              avatar_color: session.user.user_metadata?.avatar_color || '#22c55e',
            })
          } else {
            setUser(null)
          }
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    } else {
      // Use localStorage
      const localUser = getStoredUser()
      if (localUser) {
        setUser({
          id: localUser.id,
          email: localUser.email,
          display_name: localUser.display_name,
          avatar_color: localUser.avatar_color,
        })
      }
      setLoading(false)
    }
  }, [])

  return { user, loading }
}

// Hook for auth actions
export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signIn = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)

    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return { success: false, error: authError.message }
      }

      setLoading(false)
      return { success: true, message: 'Check your email for a login link!' }
    } else {
      // Use localStorage - instant sign in
      createLocalUser(email)
      setLoading(false)
      // Reload to update all user state
      window.location.reload()
      return { success: true }
    }
  }, [])

  const signOut = useCallback(async () => {
    setLoading(true)

    if (isSupabaseConfigured()) {
      const supabase = createClient()
      await supabase.auth.signOut()
    } else {
      signOutLocalUser()
    }

    setLoading(false)
    window.location.reload()
  }, [])

  return { signIn, signOut, loading, error }
}

// Check if using local storage mode
export function useStorageMode() {
  return {
    isLocal: !isSupabaseConfigured(),
    isSupabase: isSupabaseConfigured(),
  }
}
