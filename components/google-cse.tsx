"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GoogleCSEProps {
  cx?: string
  className?: string
}

// Global state to track CSE initialization
let globalCSELoaded = false
let globalCSEInitialized = false

export function GoogleCSE({ cx = "e7e2e0b1ebd0945c6", className }: GoogleCSEProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(globalCSELoaded)
  const [hasError, setHasError] = useState(false)
  const initAttempted = useRef(false)

  // Apply additional CSS fixes after CSE loads
  const applyCSEFixes = () => {
    setTimeout(() => {
      const style = document.createElement("style")
      style.textContent = `
        /* Force autocomplete styling */
        .gsc-completion-container {
          background-color: ${document.documentElement.classList.contains("dark") ? "#212529" : "hsl(var(--popover))"} !important;
          color: ${document.documentElement.classList.contains("dark") ? "#dfdfdf" : "hsl(var(--popover-foreground))"} !important;
          border: 1px solid ${document.documentElement.classList.contains("dark") ? "#343a40" : "hsl(var(--border))"} !important;
        }
        
        .gsc-completion-item {
          background-color: ${document.documentElement.classList.contains("dark") ? "#212529" : "hsl(var(--popover))"} !important;
          color: ${document.documentElement.classList.contains("dark") ? "#dfdfdf" : "hsl(var(--popover-foreground))"} !important;
        }
        
        .gsc-completion-item:hover,
        .gsc-completion-item.gsc-completion-selected {
          background-color: ${document.documentElement.classList.contains("dark") ? "#343a40" : "hsl(var(--accent))"} !important;
          color: ${document.documentElement.classList.contains("dark") ? "#ffffff" : "hsl(var(--accent-foreground))"} !important;
        }
        
        .gsc-completion-container *,
        .gsc-completion-item * {
          background-color: inherit !important;
          color: inherit !important;
        }
      `
      document.head.appendChild(style)
    }, 1000)
  }

  // Initialize CSE when component mounts
  useEffect(() => {
    const initializeCSE = () => {
      // If already initialized globally, just render
      if (globalCSEInitialized && window.google?.search?.cse?.element) {
        try {
          const searchElement = containerRef.current?.querySelector(".gcse-search")
          if (searchElement && !searchElement.hasChildNodes()) {
            window.google.search.cse.element.render({
              div: searchElement,
              tag: "search",
            })
            applyCSEFixes()
          }
          setIsLoaded(true)
          return
        } catch (error) {
          console.warn("CSE re-render error:", error)
        }
      }

      // If script is loaded but not initialized, initialize it
      if (globalCSELoaded && window.google?.search?.cse?.element && !globalCSEInitialized) {
        try {
          globalCSEInitialized = true
          setIsLoaded(true)
          applyCSEFixes()
          return
        } catch (error) {
          console.warn("CSE initialization error:", error)
        }
      }

      // Load script if not loaded
      if (!globalCSELoaded && !initAttempted.current) {
        initAttempted.current = true
        loadGoogleCSEScript()
      }
    }

    const loadGoogleCSEScript = () => {
      try {
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="cse.google.com"]')
        if (existingScript) {
          globalCSELoaded = true
          setIsLoaded(true)
          applyCSEFixes()
          return
        }

        // Create and load the Google CSE script
        const script = document.createElement("script")
        script.src = `https://cse.google.com/cse.js?cx=${cx}`
        script.async = true

        script.onload = () => {
          globalCSELoaded = true
          globalCSEInitialized = true
          setIsLoaded(true)
          applyCSEFixes()
          console.log("Google CSE script loaded successfully")
        }

        script.onerror = () => {
          console.error("Failed to load Google CSE script")
          setHasError(true)
          setIsLoaded(false)
        }

        document.head.appendChild(script)
      } catch (error) {
        console.error("Error loading Google CSE:", error)
        setHasError(true)
        setIsLoaded(false)
      }
    }

    // Override querySelector to handle invalid selectors
    const originalQuerySelector = Document.prototype.querySelector
    const originalQuerySelectorAll = Document.prototype.querySelectorAll

    Document.prototype.querySelector = function (selector: string) {
      try {
        if (selector.includes("#gsc.tab=") || selector.includes(".tab=") || selector.match(/[#.][^#.\s]*=/)) {
          console.warn("Invalid CSS selector intercepted:", selector)
          return null
        }
        return originalQuerySelector.call(this, selector)
      } catch (error) {
        console.warn("querySelector error intercepted:", error)
        return null
      }
    }

    Document.prototype.querySelectorAll = function (selector: string) {
      try {
        if (selector.includes("#gsc.tab=") || selector.includes(".tab=") || selector.match(/[#.][^#.\s]*=/)) {
          console.warn("Invalid CSS selector intercepted:", selector)
          return document.createDocumentFragment().querySelectorAll("div") as NodeListOf<Element>
        }
        return originalQuerySelectorAll.call(this, selector)
      } catch (error) {
        console.warn("querySelectorAll error intercepted:", error)
        return document.createDocumentFragment().querySelectorAll("div") as NodeListOf<Element>
      }
    }

    // Initialize CSE
    initializeCSE()

    // Cleanup function
    return () => {
      try {
        // Restore original querySelector methods
        Document.prototype.querySelector = originalQuerySelector
        Document.prototype.querySelectorAll = originalQuerySelectorAll
      } catch (error) {
        console.warn("Cleanup error (non-critical):", error)
      }
    }
  }, [cx])

  // Re-initialize CSE when container becomes visible
  useEffect(() => {
    if (isLoaded && containerRef.current && globalCSEInitialized) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const searchElement = entry.target.querySelector(".gcse-search")
              if (searchElement && !searchElement.hasChildNodes() && window.google?.search?.cse?.element) {
                try {
                  window.google.search.cse.element.render({
                    div: searchElement,
                    tag: "search",
                  })
                  applyCSEFixes()
                } catch (error) {
                  console.warn("CSE re-render on intersection error:", error)
                }
              }
            }
          })
        },
        { threshold: 0.1 },
      )

      observer.observe(containerRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [isLoaded])

  // Watch for theme changes and reapply fixes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          applyCSEFixes()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Additional error handling for window errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.message &&
        (event.message.includes("querySelector") ||
          event.message.includes("gsc.tab") ||
          event.message.includes("not a valid selector"))
      ) {
        console.warn("CSE error intercepted and handled:", event.message)
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.message && event.reason.message.includes("querySelector")) {
        console.warn("CSE promise rejection intercepted:", event.reason.message)
        event.preventDefault()
        return false
      }
    }

    window.addEventListener("error", handleError, true)
    window.addEventListener("unhandledrejection", handleUnhandledRejection, true)

    return () => {
      window.removeEventListener("error", handleError, true)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection, true)
    }
  }, [])

  if (hasError) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Busca no Site</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">
              Não foi possível carregar a busca do Google. Tente recarregar a página.
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Busca no Site</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="gcse-container">
          <div className="gcse-search" data-cx={cx} key={`cse-${cx}-${Date.now()}`}></div>
          {!isLoaded && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Carregando busca...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      search?: {
        cse?: {
          element?: {
            render?: (options: any) => void
          }
        }
      }
    }
  }
}
