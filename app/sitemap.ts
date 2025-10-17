import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://v0-brasil-search.vercel.app"

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]

  // Generate CEP pages for common ranges
  const cepPages: MetadataRoute.Sitemap = []

  // Major cities CEP ranges (sample of most important CEPs)
  const majorCepRanges = [
    // São Paulo - SP
    { start: 1000000, end: 1000100, city: "São Paulo" },
    { start: 1310000, end: 1310100, city: "São Paulo" },
    { start: 4000000, end: 4000100, city: "São Paulo" },

    // Rio de Janeiro - RJ
    { start: 20000000, end: 20000100, city: "Rio de Janeiro" },
    { start: 22000000, end: 22000100, city: "Rio de Janeiro" },

    // Belo Horizonte - MG
    { start: 30000000, end: 30000100, city: "Belo Horizonte" },
    { start: 31000000, end: 31000100, city: "Belo Horizonte" },

    // Salvador - BA
    { start: 40000000, end: 40000100, city: "Salvador" },
    { start: 41000000, end: 41000100, city: "Salvador" },

    // Fortaleza - CE
    { start: 60000000, end: 60000100, city: "Fortaleza" },

    // Brasília - DF
    { start: 70000000, end: 70000100, city: "Brasília" },

    // Curitiba - PR
    { start: 80000000, end: 80000100, city: "Curitiba" },

    // Porto Alegre - RS
    { start: 90000000, end: 90000100, city: "Porto Alegre" },

    // Recife - PE
    { start: 50000000, end: 50000100, city: "Recife" },

    // Manaus - AM
    { start: 69000000, end: 69000100, city: "Manaus" },
  ]

  // Generate CEP URLs for major ranges
  for (const range of majorCepRanges) {
    // Sample every 10th CEP to keep sitemap manageable
    for (let cep = range.start; cep <= range.end; cep += 10) {
      const cepStr = cep.toString().padStart(8, "0")
      cepPages.push({
        url: `${baseUrl}/cep/${cepStr}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    }
  }

  return [...staticPages, ...cepPages]
}
