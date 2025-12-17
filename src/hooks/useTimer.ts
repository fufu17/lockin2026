'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTimerOptions {
  initialSeconds: number
  onComplete?: () => void
  autoStart?: boolean
}

interface UseTimerReturn {
  secondsRemaining: number
  isRunning: boolean
  isComplete: boolean
  start: () => void
  pause: () => void
  reset: () => void
  getElapsedMinutes: () => number
}

export function useTimer({
  initialSeconds,
  onComplete,
  autoStart = false,
}: UseTimerOptions): UseTimerReturn {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isComplete, setIsComplete] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)

  useEffect(() => {
    if (!isRunning || isComplete) return

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          setIsComplete(true)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isComplete, onComplete])

  const start = useCallback(() => {
    if (!isComplete) {
      startTimeRef.current = Date.now()
      setIsRunning(true)
    }
  }, [isComplete])

  const pause = useCallback(() => {
    if (startTimeRef.current) {
      elapsedRef.current += Date.now() - startTimeRef.current
      startTimeRef.current = null
    }
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setSecondsRemaining(initialSeconds)
    setIsRunning(false)
    setIsComplete(false)
    startTimeRef.current = null
    elapsedRef.current = 0
  }, [initialSeconds])

  const getElapsedMinutes = useCallback(() => {
    let totalElapsed = elapsedRef.current
    if (startTimeRef.current && isRunning) {
      totalElapsed += Date.now() - startTimeRef.current
    }
    return Math.round(totalElapsed / 60000)
  }, [isRunning])

  return {
    secondsRemaining,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
    getElapsedMinutes,
  }
}
