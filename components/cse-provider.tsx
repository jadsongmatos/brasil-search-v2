"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface CSEContextType {
  isLoaded: boolean
  isInitialized: boolean
  error: string | null
}

const CSEContext = createContext<CSEContextType>({
  isLoaded: false,
  isInitialized: false,
  error: null,
})

export const useCSE = () => useContext(CSEContext)

interface CSEProviderProps {
  children: React.ReactNode
  cx?: string
}

export function CSEProvider({ children, cx = "e7e2e0b1ebd0945c6" }: CSEProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCSE = async () => {
      try {
        // Check if already loaded
        if (document.querySelector('script[src*="cse.google.com"]')) {
          setIsLoaded(true)
          setIsInitialized(true)
          return
        }

        // Load the script
        const script = document.createElement("script")
        script.src = `https://cse.google.com/cse.js?cx=${cx}`
        script.async = true

        script.onload = () => {
          setIsLoaded(true)
          // Wait a bit for Google to initialize
          setTimeout(() => {
            setIsInitialized(true)
          }, 500)
        }

        script.onerror = () => {
          setError("Failed to load Google CSE")
        }

        document.head.appendChild(script)
      } catch (err) {
        setError("Error loading Google CSE")
      }
    }

    loadCSE()
  }, [cx])

  return <CSEContext.Provider value={{ isLoaded, isInitialized, error }}>{children}</CSEContext.Provider>
}
