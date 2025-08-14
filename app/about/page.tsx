import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Iframely } from "@/components/iframely"
import { siteConfig } from "@/config/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Share2, Globe, Zap, Users } from "lucide-react"
import Image from "next/image"

export default async function AboutPage() {
  return (
    <>
      <Header active="/about" />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="container py-16">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <div className="relative">
              <Image
                className="rounded-2xl shadow-xl ring-4 ring-primary/10"
                alt="Brasil Search logo - Brazilian flag colors with tech circuit design"
                src="/images/logo.png"
                width={120}
                height={120}
                priority
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Sobre o <span className="text-primary">{siteConfig.name}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Uma plataforma moderna que aprimora e expande as funcionalidades da Brasil API, oferecendo busca
                avançada e consulta de CEPs com interface intuitiva.
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
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16">
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
                    Sistema de busca powered by Google que permite filtrar resultados por data, localização, categoria e
                    outros critérios para encontrar exatamente o que você precisa.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
                    Ferramenta especializada para consultar informações detalhadas sobre códigos postais brasileiros,
                    incluindo endereço completo, coordenadas e navegação entre CEPs.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Share2 className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Compartilhamento</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Integração com redes sociais que permite compartilhar resultados de pesquisa diretamente, expandindo
                    o alcance e facilitando a colaboração.
                  </CardDescription>
                </CardContent>
              </Card>

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
                    Otimizado para velocidade com múltiplas APIs de fallback, garantindo respostas rápidas e confiáveis
                    mesmo em condições adversas de rede.
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
                    Desenvolvido seguindo as melhores práticas de acessibilidade web, garantindo que todos os usuários
                    possam navegar e utilizar a plataforma com facilidade.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Brasil API Section */}
        <section className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Baseado na Brasil API</h2>
              <p className="text-muted-foreground text-lg">
                Construído sobre a robusta infraestrutura da Brasil API para garantir dados precisos e atualizados
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <Iframely />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
