'use client'

import { useState } from 'react'
import { LockInWall } from '@/components/LockInWall'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-16 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            ACCOUNTABILITY IS
            <br />
            <span className="text-blue-600 underline decoration-4 underline-offset-4">
              NON-NEGOTIABLE
            </span>
          </h1>
          <p className="font-mono text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Declare your objectives to the public ledger.
            <br />
            Once locked, the only exit is execution.
          </p>
        </div>
      </section>

      {/* Lock In Form */}
      <section className="py-8 px-4">
        <LockInWall />
      </section>
    </main>
  )
}
