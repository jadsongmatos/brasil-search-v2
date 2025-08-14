import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchForm } from "@/components/search-form"
import { CSEProvider } from "@/components/cse-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Globe, Info, Zap, Users, Search } from "lucide-react"

export default async function IndexPage() {
  return (
    <>
      <Header active="/" />
      <CSEProvider>
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          {/* Hero Section */}
          <section className="w-full py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    <span className="text-primary">Brasil Search</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mx-auto">
                    Busque informações sobre CEPs, cidades e muito mais do Brasil com tecnologia avançada do Google
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Google CSE
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Consulta CEP
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      API Brasileira
                    </Badge>
                  </div>
                </div>

                {/* Search Form */}
                <div className="w-full max-w-4xl mx-auto">
                  <SearchForm />
                </div>

                <Alert className="max-w-2xl mx-auto">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Dica:</strong> Use a busca do Google para encontrar conteúdo específico do site, ou consulte
                    CEPs para obter informações detalhadas sobre endereços brasileiros.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Principais Funcionalidades</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Descubra as ferramentas que tornam o Brasil Search uma plataforma completa para suas pesquisas
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Search className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Busca Avançada</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Sistema de busca powered by Google que permite encontrar conteúdo específico do Brasil Search
                        com resultados precisos e relevantes.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <a href="/cep/01001000">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-xl">Consulta CEP</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                          Ferramenta especializada para consultar informações detalhadas sobre códigos postais
                          brasileiros, incluindo endereço completo, coordenadas e navegação entre CEPs.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </a>

                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Globe className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Interface Moderna</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Design responsivo e intuitivo com suporte a tema claro/escuro, proporcionando uma experiência de
                        usuário superior em qualquer dispositivo.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Performance</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Otimizado para velocidade com múltiplas APIs de fallback, garantindo respostas rápidas e
                        confiáveis mesmo em condições adversas de rede.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Acessibilidade</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        Desenvolvido seguindo as melhores práticas de acessibilidade web, garantindo que todos os
                        usuários possam navegar e utilizar a plataforma com facilidade.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <a href="/about">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Info className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-xl">Dados Confiáveis</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                          Baseado na robusta Brasil API, oferece informações precisas e atualizadas sobre CEPs, cidades,
                          estados e outras informações relevantes do Brasil.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      </CSEProvider>
      <Footer />
    </>
  )
}
