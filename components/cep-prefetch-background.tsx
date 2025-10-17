"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface CepPrefetchBackgroundProps {
  enabled?: boolean
  interval?: number
  maxPrefetch?: number
}

export function CepPrefetchBackground({
  enabled = true,
  interval = 2000,
  maxPrefetch = 2000,
}: CepPrefetchBackgroundProps) {
  const router = useRouter()
  const prefetchedCeps = useRef(new Set<string>())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const prefetchCount = useRef(0)
  const isVisible = useRef(true)
  const lastPrefetchTime = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Generate random CEP in valid range
  const generateRandomCep = (): string => {
    const min = 1000000
    const max = 99999999
    const randomCep = Math.floor(Math.random() * (max - min + 1)) + min
    return randomCep.toString().padStart(8, "0")
  }

  // Check if CEP is likely to be valid
  const isLikelyValidCep = (cep: string): boolean => {
    const cepNum = Number.parseInt(cep, 10)

    if (cepNum < 1000000 || cepNum > 99999999) return false

    const firstTwo = Math.floor(cepNum / 1000000)

    const commonRanges = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
      43, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 55, 56, 60, 61, 62, 63, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
      81, 82, 83, 84, 85, 86, 87, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
    ]

    return commonRanges.includes(firstTwo)
  }

  // Generate smart random CEP
  const generateSmartRandomCep = (): string => {
    let attempts = 0
    let cep: string

    do {
      cep = generateRandomCep()
      attempts++
    } while (!isLikelyValidCep(cep) && attempts < 10)

    return cep
  }

  // Prefetch a random CEP
  const prefetchRandomCep = () => {
    if (!mountedRef.current) return

    const now = Date.now()

    if (now - lastPrefetchTime.current < interval * 0.8) {
      return
    }

    if (!enabled || prefetchCount.current >= maxPrefetch || !isVisible.current) {
      return
    }

    try {
      const randomCep = generateSmartRandomCep()

      if (prefetchedCeps.current.has(randomCep)) {
        return
      }

      prefetchedCeps.current.add(randomCep)
      prefetchCount.current++
      lastPrefetchTime.current = now

      router.prefetch(`/cep/${randomCep}`)

      if (prefetchedCeps.current.size > maxPrefetch * 1.2) {
        const entries = Array.from(prefetchedCeps.current)
        const toRemove = entries.slice(0, Math.floor(entries.length * 0.2))
        toRemove.forEach((cep) => prefetchedCeps.current.delete(cep))
      }
    } catch (error) {
      // Silently fail - prefetch is not critical
    }
  }

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!mountedRef.current) return

      isVisible.current = !document.hidden

      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } else {
        if (enabled && !intervalRef.current) {
          intervalRef.current = setInterval(prefetchRandomCep, interval)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [enabled, interval])

  // Start/stop prefetching
  useEffect(() => {
    if (enabled && isVisible.current && !intervalRef.current && mountedRef.current) {
      intervalRef.current = setInterval(prefetchRandomCep, interval)
    } else if (!enabled && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, interval, maxPrefetch])

  return null
}
