"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Code, Database, Zap } from "lucide-react"

export function Iframely() {
  return (
    <Card className="w-full hover:shadow-lg transition-all duration-300">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
            <Database className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">Brasil API</CardTitle>
        <CardDescription className="text-base">API gratuita para consultar informações sobre o Brasil</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Este projeto utiliza a Brasil API como base para fornecer informações precisas e atualizadas sobre CEPs,
          cidades, estados e outras informações relevantes do Brasil, expandindo suas funcionalidades com uma interface
          moderna e recursos avançados de busca.
        </p>

        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Code className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium">API RESTful</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium">Rápida</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium">Confiável</p>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => window.open("https://brasilapi.com.br", "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Visitar Brasil API
        </Button>
      </CardContent>
    </Card>
  )
}
