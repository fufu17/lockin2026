'use client'

import { Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-card-border bg-card-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              LockIn<span className="text-accent">2026</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted">
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How it works
            </a>
            <a href="#wall" className="hover:text-foreground transition-colors">
              Wall
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-light">
            Built with focus. Ship with purpose.
          </p>
        </div>
      </div>
    </footer>
  )
}
