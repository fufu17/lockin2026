'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { useUser, useAuth } from '@/hooks/useSupabase'
import { Button } from './ui/Button'
import { AuthModal } from './AuthModal'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, loading } = useUser()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-card-bg/80 backdrop-blur-lg border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                LockIn<span className="text-accent">2026</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-muted hover:text-foreground transition-colors text-sm font-medium"
              >
                How it works
              </a>
              <a
                href="#wall"
                className="text-muted hover:text-foreground transition-colors text-sm font-medium"
              >
                Wall
              </a>
              {loading ? (
                <div className="w-20 h-9 bg-surface rounded-lg animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted">
                    {user.display_name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                >
                  Log in
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-card-border bg-card-bg/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-4">
              <a
                href="#how-it-works"
                className="block text-muted hover:text-foreground transition-colors text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it works
              </a>
              <a
                href="#wall"
                className="block text-muted hover:text-foreground transition-colors text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wall
              </a>
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowAuthModal(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full"
                >
                  Log in
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
