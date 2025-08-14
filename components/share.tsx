"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface ShareProps {
  text: string
}

export function Share({ text }: ShareProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Brasil Search",
          text: text,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${text} - ${window.location.href}`)
        alert("Link copiado para a área de transferência!")
      } catch (error) {
        console.log("Error copying to clipboard:", error)
      }
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleShare} className="ml-2">
      <Share2 className="h-4 w-4" />
    </Button>
  )
}
