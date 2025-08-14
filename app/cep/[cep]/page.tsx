import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share } from "@/components/share"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, WifiOff, MapPin } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchCepData } from "@/lib/cep-service"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface CepData {
  cep: string
  city: string
  neighborhood: string
  state: string
  street: string
  location?: {
    type: string
    coordinates?: {
      longitude?: number | null
      latitude?: number | null
    }
  }
  errors?: any
  message: string
  apiErrors?: string[]
  apiAttempts?: Array<{ name: string; url: string; error?: string; success?: boolean; responseTime?: number }>
  suggestion?: string
}

interface PageProps {
  params: { cep: string }
}

export async function generateMetadata({ params }: PageProps) {
  const cep = params.cep
  const cleanCep = cep.replace(/\D/g, "").padStart(8, "0")
  const formattedCep = cleanCep.replace(/(\d{5})(\d{3})/, "$1-$2")

  // Não fazer fetch aqui para evitar cache issues, usar dados estáticos
  return {
    title: `CEP ${formattedCep} | Brasil Search`,
    description: `Consulte informações completas do CEP ${formattedCep} no Brasil Search.`,
    keywords: `CEP, ${formattedCep}, endereço, Brasil`,
  }
}

export default async function CepPage({ params }: PageProps) {
  const cep = params.cep
  const cleanCep = cep.replace(/\D/g, "").padStart(8, "0")
  const code = Number.parseInt(cleanCep, 10)

  const formatCep = (cepString: string) => {
    const clean = cepString.replace(/\D/g, "").padStart(8, "0")
    return clean.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  let content: CepData | null = null
  let error = ""
  let networkError = false

  try {
    content = await fetchCepData(cleanCep)
  } catch (err: any) {
    console.error("Error fetching CEP data:", err)

    if (err.message.includes("conectividade") || err.message.includes("rede")) {
      networkError = true
      error = "Problemas de conectividade. Verifique sua conexão com a internet."
    } else if (err.message.includes("indisponíveis") || err.message.includes("servidor")) {
      error = "Serviços temporariamente indisponíveis. Tente novamente em alguns minutos."
    } else {
      error = "Erro ao buscar dados do CEP. Tente novamente."
    }
  }

  const hasValidLocation =
    content?.location?.coordinates?.longitude != null &&
    content?.location?.coordinates?.latitude != null &&
    !isNaN(Number(content.location.coordinates.longitude)) &&
    !isNaN(Number(content.location.coordinates.latitude))

  const hasValidData = content && !content.errors && (content.city || content.state || content.street)
  const isNotFound = content?.errors && content.errors.some((err: string) => err.includes("not found"))

  return (
    <>
      <Header active="/cep/*" />
      <main className="flex flex-col items-center justify-start w-full py-8 md:py-16">
        <div className="container max-w-3xl">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  CEP: {formatCep(code.toString())}
                </div>
                <Share text={`CEP: ${formatCep(code.toString())}`} />
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && !content ? (
                <Alert>
                  <WifiOff className="h-4 w-4" />
                  <AlertTitle>Não foi possível buscar o CEP</AlertTitle>
                  <AlertDescription>
                    <div className="space-y-3">
                      <p>{error}</p>
                      <Link href={`/cep/${cleanCep}`} prefetch={true}>
                        <Button size="sm" variant="outline">
                          Tentar novamente
                        </Button>
                      </Link>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : hasValidData ? (
                <div className="grid gap-4">
                  {content.state && (
                    <div className="space-y-1">
                      <Badge variant="secondary">Estado</Badge>
                      <CardDescription className="text-base">{content.state}</CardDescription>
                    </div>
                  )}
                  {content.city && (
                    <div className="space-y-1">
                      <Badge variant="secondary">Cidade</Badge>
                      <CardDescription className="text-base">{content.city}</CardDescription>
                    </div>
                  )}
                  {content.neighborhood && (
                    <div className="space-y-1">
                      <Badge variant="secondary">Bairro</Badge>
                      <CardDescription className="text-base">{content.neighborhood}</CardDescription>
                    </div>
                  )}
                  {content.street && (
                    <div className="space-y-1">
                      <Badge variant="secondary">Rua</Badge>
                      <CardDescription className="text-base">{content.street}</CardDescription>
                    </div>
                  )}
                  {hasValidLocation && (
                    <div className="space-y-1">
                      <Badge variant="secondary">Coordenadas</Badge>
                      <CardDescription className="text-base font-mono">
                        {typeof content.location!.coordinates!.latitude === "number"
                          ? content.location!.coordinates!.latitude.toFixed(6)
                          : Number(content.location!.coordinates!.latitude).toFixed(6)}
                        ,{" "}
                        {typeof content.location!.coordinates!.longitude === "number"
                          ? content.location!.coordinates!.longitude.toFixed(6)
                          : Number(content.location!.coordinates!.longitude).toFixed(6)}
                      </CardDescription>
                    </div>
                  )}
                </div>
              ) : isNotFound ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>CEP não encontrado</AlertTitle>
                  <AlertDescription>
                    <div className="space-y-3">
                      <p>O CEP {formatCep(code.toString())} não foi encontrado.</p>
                      <p className="text-sm text-muted-foreground">
                        Verifique se o CEP está correto ou tente um CEP próximo.
                      </p>
                      <div className="flex gap-2">
                        <Link href={`/cep/${cleanCep}`} prefetch={true}>
                          <Button size="sm" variant="outline">
                            Tentar novamente
                          </Button>
                        </Link>
                        <Link href="/" prefetch={true}>
                          <Button size="sm" variant="outline">
                            Nova busca
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <WifiOff className="h-4 w-4" />
                  <AlertTitle>Serviços Indisponíveis</AlertTitle>
                  <AlertDescription>
                    <div className="space-y-3">
                      <p>Os serviços de CEP estão temporariamente indisponíveis.</p>
                      <p className="text-sm text-muted-foreground">Tente novamente em alguns minutos.</p>
                      <Link href={`/cep/${cleanCep}`} prefetch={true}>
                        <Button size="sm" variant="outline">
                          Tentar novamente
                        </Button>
                      </Link>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter>
              {/* Navigation hints with prefetch */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-muted-foreground">Use os botões acima para navegar entre CEPs adjacentes</p>
                <div className="flex justify-center gap-2">
                  <Link href="/" prefetch={true}>
                    <Button variant="ghost" size="sm">
                      Voltar ao início
                    </Button>
                  </Link>
                  <Link href="/about" prefetch={true}>
                    <Button variant="ghost" size="sm">
                      Sobre o projeto
                    </Button>
                  </Link>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
