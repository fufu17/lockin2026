export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SessionMode = 'study' | 'build' | 'content' | 'gym' | 'deep_work'
export type CommitmentStatus = 'in_progress' | 'completed' | 'expired'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          display_name: string | null
          avatar_color: string | null
        }
        Insert: {
          id: string
          created_at?: string
          display_name?: string | null
          avatar_color?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          display_name?: string | null
          avatar_color?: string | null
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string | null
          mode: string
          goal: string
          duration_minutes: number
          started_at: string
          ended_at: string | null
          focus_rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          mode: string
          goal: string
          duration_minutes: number
          started_at?: string
          ended_at?: string | null
          focus_rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          mode?: string
          goal?: string
          duration_minutes?: number
          started_at?: string
          ended_at?: string | null
          focus_rating?: number | null
          created_at?: string
        }
      }
      commitments: {
        Row: {
          id: string
          alias: string
          goal: string
          duration_minutes: number
          status: CommitmentStatus
          created_at: string
          session_id: string | null
        }
        Insert: {
          id?: string
          alias: string
          goal: string
          duration_minutes: number
          status?: CommitmentStatus
          created_at?: string
          session_id?: string | null
        }
        Update: {
          id?: string
          alias?: string
          goal?: string
          duration_minutes?: number
          status?: CommitmentStatus
          created_at?: string
          session_id?: string | null
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type Commitment = Database['public']['Tables']['commitments']['Row']

export interface SessionFormData {
  mode: SessionMode
  duration: number
  goal: string
}

export interface CommitmentFormData {
  alias: string
  goal: string
  duration: number
  startTimer: boolean
}
