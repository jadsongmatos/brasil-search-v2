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
  interval = 2000, // Padrão agora é 2 segundos
  maxPrefetch = 2000,
}: CepPrefetchBackgroundProps) {
  const router = useRouter()
  const prefetchedCeps = useRef(new Set<string>())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const prefetchCount = useRef(0)
  const isVisible = useRef(true)
  const lastPrefetchTime = useRef(0)

  // Generate random CEP in valid range
  const generateRandomCep = (): string => {
    // Generate random number between 1000000 and 99999999 (valid CEP range)
    const min = 1000000
    const max = 99999999
    const randomCep = Math.floor(Math.random() * (max - min + 1)) + min
    return randomCep.toString().padStart(8, "0")
  }

  // Check if CEP is likely to be valid (basic heuristics)
  const isLikelyValidCep = (cep: string): boolean => {
    const cepNum = Number.parseInt(cep, 10)

    // Avoid obviously invalid ranges
    if (cepNum < 1000000) return false
    if (cepNum > 99999999) return false

    // Prioritize common urban areas (rough heuristics)
    const firstTwo = Math.floor(cepNum / 1000000)

    // Major cities and states (approximate ranges)
    const commonRanges = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9, // São Paulo region
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28, // Rio de Janeiro region
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39, // Minas Gerais region
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48, // Bahia region
      50,
      51,
      52,
      53,
      54,
      55,
      56, // Pernambuco region
      60,
      61,
      62,
      63, // Ceará region
      70,
      71,
      72,
      73,
      74,
      75,
      76,
      77,
      78,
      79, // Distrito Federal region
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87, // Paraná region
      90,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99, // Rio Grande do Sul region
    ]

    return commonRanges.includes(firstTwo)
  }

  // Generate smart random CEP with higher probability for valid ranges
  const generateSmartRandomCep = (): string => {
    let attempts = 0
    let cep: string

    do {
      cep = generateRandomCep()
      attempts++
    } while (!isLikelyValidCep(cep) && attempts < 10)

    return cep
  }

  // Prefetch a random CEP with rate limiting
  const prefetchRandomCep = () => {
    const now = Date.now()

    // Rate limiting - ensure minimum time between prefetches
    if (now - lastPrefetchTime.current < interval * 0.8) {
      return
    }

    if (!enabled || prefetchCount.current >= maxPrefetch || !isVisible.current) {
      return
    }

    try {
      const randomCep = generateSmartRandomCep()

      // Skip if already prefetched
      if (prefetchedCeps.current.has(randomCep)) {
        return
      }

      // Add to prefetched set
      prefetchedCeps.current.add(randomCep)
      prefetchCount.current++
      lastPrefetchTime.current = now

      // Prefetch the CEP page
      router.prefetch(`/cep/${randomCep}`)

      console.log(`🔄 [PREFETCH] CEP ${randomCep} (${prefetchCount.current}/${maxPrefetch})`)

      // Clean up old entries if we have too many
      if (prefetchedCeps.current.size > maxPrefetch * 1.2) {
        const entries = Array.from(prefetchedCeps.current)
        const toRemove = entries.slice(0, Math.floor(entries.length * 0.2))
        toRemove.forEach((cep) => prefetchedCeps.current.delete(cep))
      }
    } catch (error) {
      console.warn("Prefetch error:", error)
    }
  }

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = !document.hidden

      if (document.hidden) {
        console.log("🔄 [PREFETCH] Paused (tab hidden)")
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } else {
        console.log("🔄 [PREFETCH] Resumed (tab visible)")
        if (enabled && !intervalRef.current) {
          intervalRef.current = setInterval(prefetchRandomCep, interval)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [enabled, interval])

  // Start/stop prefetching based on enabled state
  useEffect(() => {
    if (enabled && isVisible.current && !intervalRef.current) {
      console.log(`🔄 [PREFETCH] Started - ${interval}ms interval, max ${maxPrefetch} CEPs`)
      intervalRef.current = setInterval(prefetchRandomCep, interval)
    } else if (!enabled && intervalRef.current) {
      console.log("🔄 [PREFETCH] Stopped")
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      console.log(`🔄 [PREFETCH] Cleanup - prefetched ${prefetchCount.current} CEPs`)
    }
  }, [enabled, interval, maxPrefetch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      console.log(`🔄 [PREFETCH] Cleanup - prefetched ${prefetchCount.current} CEPs`)
    }
  }, [])

  // This component doesn't render anything
  return null
}
