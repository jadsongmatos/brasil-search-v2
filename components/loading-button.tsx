"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface LoadingButtonProps {
  children: React.ReactNode
  onClick: () => void | Promise<void>
  disabled?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  loadingText?: string
  className?: string
}

export function LoadingButton({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "default",
  loadingText = "Carregando...",
  className,
}: LoadingButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading) return

    setLoading(true)
    try {
      await onClick()
    } catch (error) {
      console.error("Button action error:", error)
    } finally {
      // Keep loading state for minimum feedback time
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick} disabled={disabled || loading} className={className}>
      {loading ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
