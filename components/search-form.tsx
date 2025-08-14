"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Sparkles } from "lucide-react"
import { GoogleCSE } from "@/components/google-cse"

export function SearchForm() {
  const [cep, setCep] = useState("")
  const router = useRouter()

  const handleCepSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cep.trim()) {
      const cleanCep = cep.replace(/\D/g, "").padStart(8, "0")
      // Navegação simples sem prefetch
      window.location.href = `/cep/${cleanCep}`
    }
  }

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) {
      return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value)
    setCep(formatted)
  }

  const exampleCeps = [
    { cep: "01001-000", city: "São Paulo - SP", cleanCep: "01001000" },
    { cep: "20040-020", city: "Rio de Janeiro - RJ", cleanCep: "20040020" },
    { cep: "30112-000", city: "Belo Horizonte - MG", cleanCep: "30112000" },
    { cep: "40070-110", city: "Salvador - BA", cleanCep: "40070110" },
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-muted rounded-lg">
            <TabsTrigger
              value="search"
              className="flex items-center gap-2 text-base py-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-all"
            >
              Busca no Site
            </TabsTrigger>
            <TabsTrigger
              value="cep"
              className="flex items-center gap-2 text-base py-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <MapPin className="h-5 w-5" />
              Busca CEP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Busca Avançada com Google</h3>
              <p className="text-muted-foreground">
                Use o Google Custom Search para encontrar conteúdo específico do Brasil Search com resultados precisos e
                relevantes
              </p>
            </div>
            <GoogleCSE className="border-0 shadow-none p-0" />
          </TabsContent>

          <TabsContent value="cep" className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Consulta de CEP</h3>
              <p className="text-muted-foreground">
                Digite um CEP para obter informações detalhadas sobre endereço, cidade, estado e coordenadas
              </p>
            </div>

            <form onSubmit={handleCepSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="cep" className="text-sm font-medium">
                  Digite o CEP
                </label>
                <Input
                  id="cep"
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={handleCepChange}
                  maxLength={9}
                  className="text-lg py-6"
                />
              </div>
              <Button type="submit" className="w-full py-6 text-lg" disabled={cep.length < 8}>
                <MapPin className="mr-2 h-5 w-5" />
                Buscar CEP
              </Button>
            </form>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>CEPs de exemplo para testar:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {exampleCeps.map((example) => (
                  <a key={example.cep} href={`/cep/${example.cleanCep}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex flex-col items-center p-3 h-auto w-full hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent"
                    >
                      <span className="font-mono text-sm">{example.cep}</span>
                      <span className="text-xs text-muted-foreground">{example.city}</span>
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
