import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LockIn2026 - Focus Sessions & Commitment Wall',
  description:
    'Lock in your goals with focused work sessions. Pick a goal. Set a timer. Prove you did the work.',
  keywords: ['focus', 'productivity', 'timer', 'commitment', 'goals', '2026'],
  authors: [{ name: 'LockIn2026' }],
  openGraph: {
    title: 'LockIn2026 - Focus Sessions & Commitment Wall',
    description:
      'Lock in your goals with focused work sessions. Pick a goal. Set a timer. Prove you did the work.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LockIn2026 - Focus Sessions & Commitment Wall',
    description:
      'Lock in your goals with focused work sessions. Pick a goal. Set a timer. Prove you did the work.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        {children}
      </body>
    </html>
  )
}
