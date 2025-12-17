'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for development without Supabase configured
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOtp: async () => ({ error: { message: 'Supabase not configured' } }),
        signOut: async () => ({}),
        exchangeCodeForSession: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          order: () => ({
            limit: async () => ({ data: [], error: null }),
          }),
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
          single: async () => ({ data: null, error: null }),
        }),
        insert: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: async () => ({ data: null, error: null }),
            }),
          }),
        }),
      }),
      channel: () => ({
        on: function() { return this },
        subscribe: () => ({}),
      }),
      removeChannel: () => {},
    } as unknown as ReturnType<typeof createBrowserClient>
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
