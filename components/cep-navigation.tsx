"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react"

interface CepNavigationProps {
  currentCep: number
}

export function CepNavigation({ currentCep }: CepNavigationProps) {
  const [loading, setLoading] = useState(false)

  const handleNavigation = () => {
    setLoading(true)
    // Reset loading after navigation starts
    setTimeout(() => setLoading(false), 1000)
  }

  const previousCep = currentCep - 1
  const nextCep = currentCep + 1

  return (
    <div className="flex justify-between w-full">
      {/* Previous Button */}
      {previousCep > 0 ? (
        <Link href={`/cep/${previousCep}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNavigation}
            disabled={loading}
            className="min-w-[120px] bg-transparent"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </>
            )}
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled={true} className="min-w-[120px] bg-transparent opacity-50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
      )}

      {/* Next Button */}
      {nextCep < 99999999 ? (
        <Link href={`/cep/${nextCep}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNavigation}
            disabled={loading}
            className="min-w-[120px] bg-transparent"
          >
            {loading ? (
              <>
                Carregando...
                <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled={true} className="min-w-[120px] opacity-50 bg-transparent">
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
