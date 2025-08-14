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

interface ApiConfig {
  name: string
  url: (cep: string) => string
  timeout: number
  headers: Record<string, string>
  parseResponse: (data: any, cep: string) => Partial<CepData>
  isNotFound: (response: Response, data: any) => boolean
}

// Timeout wrapper for fetch requests with better error handling
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 15000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const startTime = Date.now()
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      // Remove cache for garantir dados sempre atualizados
      cache: "no-store",
    })
    const responseTime = Date.now() - startTime
    clearTimeout(timeoutId)
    return { response, responseTime }
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(`Timeout after ${timeout}ms`)
      }
      if (error.message.includes("fetch")) {
        throw new Error("Network connection failed")
      }
    }
    throw error
  }
}

// API configurations with specific parsing logic for each service
const apiConfigs: ApiConfig[] = [
  {
    name: "Brasil API",
    url: (cep) => `https://brasilapi.com.br/api/cep/v2/${cep}`,
    timeout: 12000,
    headers: {
      Accept: "application/json",
      "User-Agent": "Brasil-Search/1.0",
    },
    parseResponse: (data, cep) => ({
      cep: data.cep || cep,
      city: data.city || "",
      neighborhood: data.neighborhood || "",
      state: data.state || "",
      street: data.street || "",
      location: {
        type: "Point",
        coordinates: {
          longitude: data.location?.coordinates?.longitude ? Number(data.location.coordinates.longitude) : null,
          latitude: data.location?.coordinates?.latitude ? Number(data.location.coordinates.latitude) : null,
        },
      },
    }),
    isNotFound: (response, data) => response.status === 404,
  },
  {
    name: "ViaCEP",
    url: (cep) => `https://viacep.com.br/ws/${cep}/json/`,
    timeout: 15000,
    headers: {
      Accept: "application/json",
    },
    parseResponse: (data, cep) => ({
      cep: data.cep?.replace(/\D/g, "") || cep,
      city: data.localidade || "",
      neighborhood: data.bairro || "",
      state: data.uf || "",
      street: data.logradouro || "",
      location: {
        type: "Point",
        coordinates: {
          longitude: null,
          latitude: null,
        },
      },
    }),
    isNotFound: (response, data) => data?.erro === true,
  },
  {
    name: "PostmonAPI",
    url: (cep) => `https://api.postmon.com.br/v1/cep/${cep}`,
    timeout: 18000,
    headers: {
      Accept: "application/json",
    },
    parseResponse: (data, cep) => ({
      cep: data.cep?.replace(/\D/g, "") || cep,
      city: data.cidade || data.city || "",
      neighborhood: data.distrito || data.neighborhood || "",
      state: data.estado || data.state || "",
      street: data.logradouro || data.street || "",
      location: {
        type: "Point",
        coordinates: {
          longitude: null,
          latitude: null,
        },
      },
    }),
    isNotFound: (response, data) => response.status === 404,
  },
  {
    name: "CEP Aberto",
    url: (cep) => `https://www.cepaberto.com/api/v3/cep?cep=${cep}`,
    timeout: 15000,
    headers: {
      Accept: "application/json",
    },
    parseResponse: (data, cep) => ({
      cep: data.cep?.replace(/\D/g, "") || cep,
      city: data.city || "",
      neighborhood: data.district || "",
      state: data.state || "",
      street: data.address || "",
      location: {
        type: "Point",
        coordinates: {
          longitude: data.longitude ? Number(data.longitude) : null,
          latitude: data.latitude ? Number(data.latitude) : null,
        },
      },
    }),
    isNotFound: (response, data) => data?.status === 400 || response.status === 404,
  },
]

// Define error types for better classification
type ErrorType = "not_found" | "network" | "server" | "unknown"

function classifyError(error: string): ErrorType {
  const lowerError = error.toLowerCase()

  // CEP not found errors
  if (lowerError.includes("cep not found") || lowerError.includes("not found") || lowerError.includes("404")) {
    return "not_found"
  }

  // Network/connectivity errors
  if (
    lowerError.includes("timeout") ||
    lowerError.includes("network connection failed") ||
    lowerError.includes("fetch failed") ||
    lowerError.includes("connection") ||
    lowerError.includes("network")
  ) {
    return "network"
  }

  // Server errors
  if (
    lowerError.includes("server error") ||
    lowerError.includes("500") ||
    lowerError.includes("502") ||
    lowerError.includes("503") ||
    lowerError.includes("504")
  ) {
    return "server"
  }

  return "unknown"
}

async function tryApi(
  config: ApiConfig,
  cep: string,
): Promise<{ success: boolean; data?: CepData; error?: string; responseTime?: number; errorType?: ErrorType }> {
  try {
    console.log(`🔍 Tentando ${config.name} para CEP: ${cep}`)
    console.log(`📡 URL: ${config.url(cep)}`)

    const { response, responseTime } = await fetchWithTimeout(
      config.url(cep),
      { headers: config.headers },
      config.timeout,
    )

    console.log(`⏱️ ${config.name} respondeu em ${responseTime}ms`)

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`❌ ${config.name}: CEP não encontrado (404)`)
        return { success: false, error: "CEP not found", responseTime, errorType: "not_found" }
      }
      if (response.status >= 500) {
        console.log(`🔥 ${config.name}: Erro do servidor (${response.status})`)
        return { success: false, error: `Server error (${response.status})`, responseTime, errorType: "server" }
      }
      console.log(`⚠️ ${config.name}: HTTP ${response.status}`)
      return { success: false, error: `HTTP ${response.status}`, responseTime, errorType: "unknown" }
    }

    const data = await response.json()
    console.log(`📦 ${config.name} dados recebidos:`, data)

    if (config.isNotFound(response, data)) {
      console.log(`❌ ${config.name}: CEP não encontrado (resposta da API)`)
      return { success: false, error: "CEP not found", responseTime, errorType: "not_found" }
    }

    const parsedData = config.parseResponse(data, cep)

    // Validate that we got meaningful data
    if (!parsedData.city && !parsedData.state && !parsedData.street) {
      console.log(`⚠️ ${config.name}: Resposta vazia`)
      return { success: false, error: "Empty response", responseTime, errorType: "unknown" }
    }

    const result: CepData = {
      ...parsedData,
      errors: null,
      message: config.name,
      cep: parsedData.cep || cep,
      city: parsedData.city || "",
      neighborhood: parsedData.neighborhood || "",
      state: parsedData.state || "",
      street: parsedData.street || "",
    }

    console.log(`✅ ${config.name} sucesso! Dados processados:`, result)
    return { success: true, data: result, responseTime }
  } catch (error: any) {
    console.error(`💥 ${config.name} erro:`, error.message)
    const errorType = classifyError(error.message)
    return {
      success: false,
      error: error.message || "Unknown error",
      responseTime: 0,
      errorType,
    }
  }
}

export async function fetchCepData(cep: string): Promise<CepData> {
  const cleanCep = cep.replace(/\D/g, "").padStart(8, "0")

  console.log(`🚀 [SERVER] Iniciando busca para CEP: ${cleanCep}`)

  // Input validation
  if (cleanCep.length !== 8 || !/^\d{8}$/.test(cleanCep)) {
    console.error("❌ CEP inválido:", cleanCep)
    throw new Error("CEP deve ter 8 dígitos")
  }

  const cepNumber = Number.parseInt(cleanCep, 10)
  if (cepNumber < 1000000 || cepNumber > 99999999) {
    console.error("❌ CEP fora da faixa válida:", cleanCep)
    throw new Error("CEP fora da faixa válida (01000-000 a 99999-999)")
  }

  const errors: string[] = []
  const apiAttempts: Array<{
    name: string
    url: string
    error?: string
    success?: boolean
    responseTime?: number
    errorType?: ErrorType
  }> = []

  console.log(`📋 [SERVER] Tentando ${apiConfigs.length} APIs: ${apiConfigs.map((c) => c.name).join(", ")}`)

  // Try each API in sequence
  for (const config of apiConfigs) {
    const attempt = {
      name: config.name,
      url: config.url(cleanCep),
      success: false,
      responseTime: 0,
      errorType: "unknown" as ErrorType,
    }

    try {
      const result = await tryApi(config, cleanCep)

      attempt.responseTime = result.responseTime || 0
      attempt.errorType = result.errorType || "unknown"

      if (result.success && result.data) {
        attempt.success = true
        apiAttempts.push(attempt)

        console.log(`🎉 [SERVER] Sucesso! CEP encontrado via ${config.name}`)
        console.log("📊 [SERVER] Resumo das tentativas:", apiAttempts)

        // Add attempt history to successful result
        result.data.apiAttempts = apiAttempts
        return result.data
      } else {
        attempt.error = result.error
        errors.push(`${config.name}: ${result.error}`)
        console.log(`❌ [SERVER] ${config.name} falhou: ${result.error} (tipo: ${result.errorType})`)
      }
    } catch (error: any) {
      const errorType = classifyError(error.message)
      attempt.error = error.message
      attempt.errorType = errorType
      errors.push(`${config.name}: ${error.message}`)
      console.error(`💥 [SERVER] ${config.name} exceção:`, error.message, `(tipo: ${errorType})`)
    }

    apiAttempts.push(attempt)

    // Smaller delay for server-side requests
    if (apiAttempts.length < apiConfigs.length) {
      console.log("⏳ [SERVER] Aguardando 300ms antes da próxima tentativa...")
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  }

  console.log("📊 [SERVER] Todas as APIs falharam. Resumo final:")
  console.table(apiAttempts)

  // Analyze the types of errors we encountered using the new classification
  const errorsByType = apiAttempts.reduce(
    (acc, attempt) => {
      if (attempt.errorType) {
        acc[attempt.errorType] = (acc[attempt.errorType] || 0) + 1
      }
      return acc
    },
    {} as Record<ErrorType, number>,
  )

  const notFoundErrors = errorsByType.not_found || 0
  const networkErrors = errorsByType.network || 0
  const serverErrors = errorsByType.server || 0
  const unknownErrors = errorsByType.unknown || 0

  console.log(`📈 [SERVER] Análise de erros por tipo:`)
  console.log(`   - CEP não encontrado: ${notFoundErrors}/${apiConfigs.length}`)
  console.log(`   - Erros de rede: ${networkErrors}/${apiConfigs.length}`)
  console.log(`   - Erros de servidor: ${serverErrors}/${apiConfigs.length}`)
  console.log(`   - Erros desconhecidos: ${unknownErrors}/${apiConfigs.length}`)

  // If all APIs returned "not found", the CEP likely doesn't exist
  if (notFoundErrors === apiConfigs.length) {
    console.log("🚫 [SERVER] Conclusão: CEP não existe em nenhuma base de dados")
    return {
      cep: cleanCep,
      city: "",
      neighborhood: "",
      state: "",
      street: "",
      errors: ["CEP not found in any database"],
      message: "CEP não encontrado em nenhuma base de dados",
      apiErrors: errors,
      apiAttempts,
    }
  }

  // If we have mostly network errors, it's a connectivity issue
  if (networkErrors >= apiConfigs.length / 2) {
    console.log("🌐 [SERVER] Conclusão: Problemas de conectividade")
    throw new Error(
      `Problemas de conectividade detectados. ${networkErrors} de ${apiConfigs.length} APIs falharam por problemas de rede. Verifique sua conexão e tente novamente.`,
    )
  }

  // If we have mostly server errors, the services are down
  if (serverErrors >= apiConfigs.length / 2) {
    console.log("🔥 [SERVER] Conclusão: Serviços indisponíveis")
    throw new Error(
      `Serviços de CEP temporariamente indisponíveis. ${serverErrors} de ${apiConfigs.length} APIs estão com problemas no servidor. Tente novamente em alguns minutos.`,
    )
  }

  // If most errors are "not found", treat as CEP not found
  if (notFoundErrors >= apiConfigs.length / 2) {
    console.log("🚫 [SERVER] Conclusão: CEP provavelmente não existe")
    return {
      cep: cleanCep,
      city: "",
      neighborhood: "",
      state: "",
      street: "",
      errors: ["CEP not found in most databases"],
      message: "CEP não encontrado na maioria das bases de dados",
      apiErrors: errors,
      apiAttempts,
    }
  }

  // Mixed errors - analyze the combination
  const totalRealErrors = networkErrors + serverErrors
  if (totalRealErrors >= apiConfigs.length / 2) {
    if (networkErrors > serverErrors) {
      console.log("🌐 [SERVER] Conclusão: Problemas de conectividade predominantes")
      throw new Error(
        `Problemas de conectividade detectados. ${networkErrors} APIs falharam por problemas de rede, ${notFoundErrors} não encontraram o CEP.`,
      )
    } else {
      console.log("🔥 [SERVER] Conclusão: Problemas de servidor predominantes")
      throw new Error(
        `Serviços temporariamente indisponíveis. ${serverErrors} APIs com problemas de servidor, ${notFoundErrors} não encontraram o CEP.`,
      )
    }
  }

  // If we have a mix but mostly "not found", it's likely the CEP doesn't exist
  console.log("🔍 [SERVER] Conclusão: Resultados mistos, mas CEP provavelmente não existe")
  return {
    cep: cleanCep,
    city: "",
    neighborhood: "",
    state: "",
    street: "",
    errors: ["Mixed results, CEP likely not found"],
    message: "CEP não encontrado na maioria das bases de dados",
    apiErrors: errors,
    apiAttempts,
  }
}
