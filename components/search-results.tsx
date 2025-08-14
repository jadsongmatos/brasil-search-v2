import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, Globe, MapPin } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
  formattedUrl: string
  htmlTitle: string
  htmlSnippet: string
  pagemap?: {
    metatags?: Array<{
      [key: string]: string
    }>
  }
}

interface SearchResultsData {
  items?: SearchResult[]
  searchInformation?: {
    totalResults: string
    searchTime: number
  }
  queries?: {
    request?: Array<{
      totalResults: string
      searchTerms: string
    }>
  }
}

interface SearchResultsProps {
  results: SearchResultsData
  query: string
}

export function SearchResults({ results, query }: SearchResultsProps) {
  const { items = [], searchInformation } = results

  if (!items.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground">
                Não encontramos resultados para "<strong>{query}</strong>"
              </p>
              <p className="text-sm text-muted-foreground">
                Tente usar palavras-chave diferentes ou verifique a ortografia.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" asChild>
                <Link href="/">Voltar ao início</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cep/01001000">Buscar CEP</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getResultIcon = (link: string) => {
    if (link.includes("/cep/")) {
      return <MapPin className="h-4 w-4 text-blue-500" />
    }
    return <Globe className="h-4 w-4 text-green-500" />
  }

  const getResultType = (link: string) => {
    if (link.includes("/cep/")) return "CEP"
    if (link.includes("/about")) return "Sobre"
    if (link === "/") return "Página Inicial"
    return "Página"
  }

  return (
    <div className="space-y-6">
      {searchInformation && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
          <span>
            Aproximadamente <strong>{Number(searchInformation.totalResults).toLocaleString()}</strong> resultados
          </span>
          <span>({searchInformation.searchTime.toFixed(2)} segundos)</span>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-all duration-200 hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    {getResultIcon(item.link)}
                    <Badge variant="secondary" className="text-xs">
                      {getResultType(item.link)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.displayLink}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    <Link
                      href={item.link}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                      target={item.link.startsWith("http") ? "_blank" : "_self"}
                      rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <span dangerouslySetInnerHTML={{ __html: item.htmlTitle || item.title }} />
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs text-green-600 dark:text-green-400 font-mono">
                    {item.formattedUrl}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={item.link}
                    target={item.link.startsWith("http") ? "_blank" : "_self"}
                    rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={`Abrir ${item.title}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p
                className="text-sm text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.htmlSnippet || item.snippet }}
              />

              {item.pagemap?.metatags?.[0] && (
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  {item.pagemap.metatags[0]["article:published_time"] && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(item.pagemap.metatags[0]["article:published_time"]).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  )}
                  {item.pagemap.metatags[0]["og:type"] && (
                    <Badge variant="outline" className="text-xs">
                      {item.pagemap.metatags[0]["og:type"]}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length >= 10 && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Mostrando os primeiros <strong>{items.length}</strong> resultados para "<strong>{query}</strong>"
              </p>
              <p className="text-xs text-muted-foreground">
                Para ver mais resultados, refine sua busca ou use termos mais específicos.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
